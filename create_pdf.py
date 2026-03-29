from reportlab.pdfgen import canvas

def create_sample_pdf():
    c = canvas.Canvas("test.pdf")
    c.drawString(100, 750, "Hello, this is a test PDF document.")
    c.drawString(100, 730, "It contains some extracted text data.")
    c.drawString(100, 710, "Patient Name: Richard Geller")
    c.drawString(100, 690, "Condition: Post-Op Checkup")
    c.save()

if __name__ == "__main__":
    create_sample_pdf()
