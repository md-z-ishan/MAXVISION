from io import BytesIO
from django.template.loader import get_template
from django.conf import settings
from django.core.mail import send_mail
import uuid
import logging

logger = logging.getLogger(__name__)

def render_to_pdf(template_src, context_dict={}):
    """
    Generate professional PDF invoice using ReportLab.
    Falls back gracefully if reportlab is unavailable.
    """
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib import colors

        buf = BytesIO()
        doc = SimpleDocTemplate(
            buf,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )
        styles = getSampleStyleSheet()

        brand_color = colors.HexColor('#000042')
        teal_color = colors.HexColor('#329C92')
        gray_color = colors.HexColor('#555555')
        light_bg = colors.HexColor('#F8FAFC')

        title_style = ParagraphStyle(
            'InvoiceTitle',
            parent=styles['Heading1'],
            fontSize=22,
            leading=26,
            textColor=brand_color,
            fontName='Helvetica-Bold'
        )
        subtitle_style = ParagraphStyle(
            'InvoiceSubtitle',
            parent=styles['Normal'],
            fontSize=9,
            leading=13,
            textColor=gray_color
        )
        section_style = ParagraphStyle(
            'SectionTitle',
            parent=styles['Heading3'],
            fontSize=11,
            leading=15,
            textColor=brand_color,
            fontName='Helvetica-Bold'
        )
        normal_style = ParagraphStyle(
            'NormalSmall',
            parent=styles['Normal'],
            fontSize=9,
            leading=13,
            textColor=colors.black
        )
        bold_style = ParagraphStyle(
            'BoldSmall',
            parent=styles['Normal'],
            fontSize=9,
            leading=13,
            fontName='Helvetica-Bold',
            textColor=colors.black
        )

        order = context_dict.get('order')
        invoice = context_dict.get('invoice')
        invoice_number = context_dict.get('invoice_number') or (invoice.serial_number if invoice else 'INV-PREVIEW')
        order_date = order.created_at.strftime('%d-%b-%Y %I:%M %p') if (order and hasattr(order, 'created_at')) else 'N/A'

        story = []

        # Header Table: Company info on Left, Invoice meta on Right
        company_p = Paragraph(
            "<b>MAXVISION OPTICAL</b><br/>"
            "Shop 4, Sheetal Tower, Taxi Stand<br/>"
            "Main Road, Ranchi, Jharkhand - 834001<br/>"
            "Phone: +91 7485067874 / 7033353140",
            subtitle_style
        )
        gstin_val = getattr(settings, 'SHOP_GSTIN', None)
        gstin_line = f"<br/>GSTIN: {gstin_val}" if gstin_val else ""

        meta_p = Paragraph(
            f"<b>TAX INVOICE</b><br/>"
            f"<b>Invoice #:</b> {invoice_number}<br/>"
            f"<b>Order ID:</b> #{order.id if order else 'N/A'}<br/>"
            f"<b>Date:</b> {order_date}"
            f"{gstin_line}",
            normal_style
        )
        header_table = Table([[company_p, meta_p]], colWidths=[320, 220])
        header_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
        ]))
        story.append(header_table)
        story.append(Spacer(1, 15))
        story.append(HRFlowable(width="100%", thickness=1.5, color=teal_color, spaceBefore=0, spaceAfter=15))

        # Bill To & Delivery Mode Table
        customer_name = order.user.get_full_name() or order.user.username if order else 'Valued Customer'
        customer_mobile = order.mobile if order else 'N/A'
        delivery_mode = order.delivery_type if order else 'DELIVERY'
        delivery_lbl = 'Store Pickup (Ranchi)' if delivery_mode == 'PICKUP' else 'Home Delivery'
        address_text = order.address if order else 'Shop 4, Sheetal Tower, Taxi Stand, Main Road, Ranchi'

        bill_to_p = Paragraph(
            f"<b>Billed & Shipped To:</b><br/>"
            f"<b>Name:</b> {customer_name}<br/>"
            f"<b>Phone:</b> {customer_mobile}<br/>"
            f"<b>Delivery Mode:</b> {delivery_lbl}<br/>"
            f"<b>Address:</b> {address_text}",
            normal_style
        )
        pay_info_p = Paragraph(
            f"<b>Payment Information:</b><br/>"
            f"<b>Method:</b> {order.payment_method if order else 'COD'}<br/>"
            f"<b>Payment Status:</b> {order.payment_status if order else 'UNPAID'}<br/>"
            f"<b>UTR / Ref #:</b> {order.utr_number or 'N/A' if order else 'N/A'}",
            normal_style
        )
        cust_table = Table([[bill_to_p, pay_info_p]], colWidths=[320, 220])
        cust_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BACKGROUND', (0, 0), (-1, -1), light_bg),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(cust_table)
        story.append(Spacer(1, 15))

        # Items Table
        items_data = [
            [
                Paragraph("<b>Item Description</b>", bold_style),
                Paragraph("<b>Package / Lens</b>", bold_style),
                Paragraph("<b>Qty</b>", bold_style),
                Paragraph("<b>Price (Rs)</b>", bold_style),
                Paragraph("<b>Amount (Rs)</b>", bold_style)
            ]
        ]

        items_list = []
        if order and hasattr(order, 'items'):
            items_list = list(order.items.all())
        elif 'items' in context_dict:
            items_list = context_dict['items']

        subtotal_sum = 0.0
        for item in items_list:
            prod_name = getattr(item.product, 'name', 'Eyewear Frame')
            brand = getattr(item.product, 'brand', '')
            full_desc = f"<b>{prod_name}</b>" + (f" ({brand})" if brand else "")
            lens_pkg = getattr(item, 'lens_package', 'frame_only').replace('_', ' ').title()
            qty = getattr(item, 'quantity', 1)
            unit_price = getattr(item, 'price', 0.0) + getattr(item, 'lens_price', 0.0)
            line_subtotal = item.subtotal() if hasattr(item, 'subtotal') else (qty * unit_price)
            subtotal_sum += float(line_subtotal)

            items_data.append([
                Paragraph(full_desc, normal_style),
                Paragraph(lens_pkg, normal_style),
                Paragraph(str(qty), normal_style),
                Paragraph(f"{unit_price:.2f}", normal_style),
                Paragraph(f"{line_subtotal:.2f}", normal_style)
            ])

        # If empty
        if len(items_data) == 1:
            items_data.append([
                Paragraph("No items listed", normal_style),
                Paragraph("-", normal_style),
                Paragraph("1", normal_style),
                Paragraph("0.00", normal_style),
                Paragraph("0.00", normal_style)
            ])

        # Summary Rows
        delivery_charge = getattr(order, 'delivery_charge', 0.0) if order else 0.0
        total_payable = getattr(order, 'total_amount', subtotal_sum + delivery_charge) if order else (subtotal_sum + delivery_charge)

        items_data.append([
            "", "", "",
            Paragraph("<b>Items Subtotal:</b>", normal_style),
            Paragraph(f"<b>Rs {subtotal_sum:.2f}</b>", normal_style)
        ])
        items_data.append([
            "", "", "",
            Paragraph("<b>Delivery Charge:</b>", normal_style),
            Paragraph("<b>FREE</b>" if float(delivery_charge) == 0 else f"<b>Rs {delivery_charge:.2f}</b>", normal_style)
        ])
        items_data.append([
            "", "", "",
            Paragraph("<b>Grand Total:</b>", bold_style),
            Paragraph(f"<b>Rs {float(total_payable):.2f}</b>", bold_style)
        ])

        items_table = Table(items_data, colWidths=[180, 140, 40, 90, 90])
        items_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), light_bg),
            ('LINEBELOW', (0, 0), (-1, 0), 1, brand_color),
            ('ALIGN', (2, 0), (4, -1), 'RIGHT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
            ('LINEBELOW', (0, 1), (-1, len(items_data) - 4), 0.5, colors.HexColor('#E2E8F0')),
            ('LINEABOVE', (3, len(items_data) - 3), (-1, -1), 0.5, teal_color),
        ]))
        story.append(items_table)
        story.append(Spacer(1, 20))

        # Footer notes
        footer_p = Paragraph(
            "<b>Thank you for choosing MAXVISION Optical!</b><br/>"
            "• Free eye checkup included on all frame purchases.<br/>"
            "• All lenses include certified UV & Blu Cut coating.<br/>"
            "• For inquiries or lens modifications, contact us on WhatsApp at +91 7485067874.",
            subtitle_style
        )
        story.append(footer_p)

        doc.build(story)
        buf.seek(0)
        return buf

    except Exception as e:
        logger.error(f"ReportLab PDF generation error: {e}")
        pdf = BytesIO()
        pdf.write(f"MAXVISION Optical - Invoice #{context_dict.get('invoice_number', 'N/A')}\nError generating PDF layout: {e}".encode('utf-8'))
        pdf.seek(0)
        return pdf

def generate_serial_number():
    return str(uuid.uuid4()).upper().replace('-', '')[:10]

def notify_shop(order):
    """
    Send an order summary notification email to the store owner.
    Falls back silently on local setups without blocking the order flow.
    """
    shop_email = getattr(settings, 'SHOP_NOTIFY_EMAIL', None)
    if not shop_email:
        return

    subject = f"[New Order #{order.id}] {order.user.username} - Rs {order.total_amount}"
    items_summary = "\n".join([
        f"- {item.quantity}x {item.product.name} ({item.lens_package}) @ Rs {item.subtotal()}"
        for item in order.items.all()
    ])

    message = (
        f"New Order Received at MAXVISION Optical!\n"
        f"-----------------------------------------\n"
        f"Order ID: #{order.id}\n"
        f"Customer: {order.user.get_full_name() or order.user.username}\n"
        f"Mobile: {order.mobile}\n"
        f"Payment Method: {order.payment_method} ({order.payment_status})\n"
        f"UTR Number: {order.utr_number or 'N/A'}\n"
        f"Delivery Mode: {order.delivery_type}\n"
        f"Address: {order.address}\n\n"
        f"Ordered Items:\n{items_summary}\n\n"
        f"Total Amount: Rs {order.total_amount}\n\n"
        f"Please verify payment in Django Admin and initiate lens processing."
    )

    try:
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'orders@maxvision.com')
        send_mail(subject, message, from_email, [shop_email], fail_silently=True)
    except Exception as e:
        logger.error(f"Failed to send shop notification email for order #{order.id}: {e}")

