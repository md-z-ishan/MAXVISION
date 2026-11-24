import os
from django.conf import settings
from django.http import HttpResponseForbidden, Http404
from django.views.static import serve

def protected_media_serve(request, path):
    """
    Guards sensitive customer documents (prescriptions and invoices) against direct public/anonymous URL access.
    Public product images, banners, and payment QR images remain accessible for storefront operation.
    """
    normalized_path = os.path.normpath(path).lstrip('/')

    if normalized_path.startswith('prescriptions') or 'prescriptions/' in normalized_path:
        return HttpResponseForbidden(
            "Direct access to medical prescriptions is blocked for privacy and compliance. "
            "Please use the authenticated endpoint /api/orders/<id>/prescription/."
        )

    if normalized_path.startswith('invoices') or 'invoices/' in normalized_path:
        return HttpResponseForbidden(
            "Direct access to financial invoices is blocked. "
            "Please use the authenticated endpoint /api/orders/<id>/invoice/."
        )

    return serve(request, path, document_root=settings.MEDIA_ROOT)

