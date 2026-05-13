from io import BytesIO
from django.template.loader import get_template
import uuid

def render_to_pdf(template_src, context_dict={}):
    # Mocked PDF generation to avoid xhtml2pdf and pycairo dependency issues
    pdf = BytesIO()
    pdf.write(b"Mock PDF Content. Please install xhtml2pdf to generate real PDFs.")
    return pdf

def generate_serial_number():
    return str(uuid.uuid4()).upper().replace('-', '')[:10]
