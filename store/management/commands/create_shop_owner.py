import sys
import getpass
from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from django.contrib.auth.models import User, Group

class Command(BaseCommand):
    help = "Securely create the single designated Shop Owner account with restricted business permissions."

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, help='Shop owner username')
        parser.add_argument('--email', type=str, help='Shop owner email')
        parser.add_argument('--password', type=str, help='Shop owner password (non-interactive, used for testing only)')
        parser.add_argument('--rotate', action='store_true', help='Deactivate existing active shop owner and create a new one')

    def handle(self, *args, **options):
        self.stdout.write("=== MAXVISION Optical: Create Designated Shop Owner Account ===\n")

        # 1. Ensure Shop Owner role and permissions are initialized
        call_command('setup_roles')
        owner_group = Group.objects.get(name='Shop Owner')

        # 2. Check for existing active shop owner accounts
        existing_owners = User.objects.filter(groups=owner_group, is_active=True)
        if existing_owners.exists():
            active_owner_names = list(existing_owners.values_list('username', flat=True))
            if not options.get('rotate'):
                raise CommandError(
                    f"Architecture Violation: Exactly one designated active Shop Owner account is permitted.\n"
                    f"An active Shop Owner already exists: {active_owner_names}.\n"
                    f"To replace or rotate the Shop Owner account, pass the --rotate flag or deactivate the existing account in Django Admin as Developer superuser."
                )
            else:
                self.stdout.write(self.style.WARNING(f"Deactivating existing Shop Owner account(s): {active_owner_names}..."))
                existing_owners.update(is_active=False)

        # 3. Collect credentials
        username = options.get('username')
        if not username:
            username = input("Enter Shop Owner username: ").strip()
        if not username:
            raise CommandError("Username cannot be empty.")

        email = options.get('email')
        if not email:
            email = input("Enter Shop Owner email: ").strip()

        password = options.get('password')
        if not password:
            password = getpass.getpass("Enter Shop Owner password: ")
            confirm_password = getpass.getpass("Confirm Shop Owner password: ")
            if password != confirm_password:
                raise CommandError("Passwords do not match.")

        if len(password) < 8:
            raise CommandError("Password must be at least 8 characters long.")

        # 4. Check if username already exists
        if User.objects.filter(username=username).exists():
            raise CommandError(f"User '{username}' already exists. Please choose a different username.")

        # 5. Create user strictly as staff=True, superuser=False
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_staff=True,
            is_superuser=False,
            is_active=True
        )

        # 6. Assign to Shop Owner group
        user.groups.add(owner_group)
        user.save()

        self.stdout.write(self.style.SUCCESS(
            f"\nDesignated Shop Owner account '{username}' created successfully!\n"
            f"Role: Shop Owner (is_staff=True, is_superuser=False)\n"
            f"Permissions: Business management only via Django Admin."
        ))

