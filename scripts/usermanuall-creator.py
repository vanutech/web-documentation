
import markdown
import os


import asyncio
from playwright.async_api import async_playwright

from xhtml2pdf import pisa

def convert_html_to_pdf(html_string, pdf_path):

  with open(pdf_path, "wb") as pdf_file:
    pisa_status = pisa.CreatePDF(html_string, dest=pdf_file)
  return not pisa_status.err


async def html_to_pdf(html_content, output_path):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.set_content(html_content)

        # Inject CSS to set the margin of the page
        await page.evaluate("""
            () => {
                const style = document.createElement('style');
                style.innerHTML = `
                    body {
                        margin: 30px
                    }
                `;
                document.head.appendChild(style);
            }
        """)
        # Ensure all resources are loaded
        await page.wait_for_load_state('networkidle')
        
        # Emulate media type
        await page.emulate_media(media='screen')
        # Set viewport size
        await page.set_viewport_size({'width': 1024, 'height': 768})

        await page.pdf(path=output_path, 
                       width='5in', 
                       height='5in',
                       print_background=True,)
        await browser.close()


def convert_markdown_to_pdf_html(markdown_file, pdf_file):
    # Read the Markdown file
    # need to install chromium with "playwright install" in command line
    with open(markdown_file, 'r', encoding='utf-8') as file:
        markdown_content = file.read()


    #custom implementaion of next page
    markdown_content = markdown_content.replace('<!--- nextpage -->', '<div class="page-break"></div>')

    # Convert Markdown to HTML
    html_content = markdown.markdown(markdown_content, extensions=['tables'])

    html_content = html_content.replace('src="', 'src="static')
    #html_file = "index.html"
    #with open(html_file, 'w', encoding='utf-8') as file:
    #    file.write(html_content)

    header = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom HTML to PDF</title>
    <style>
        .page-break {
            page-break-before: always;
        }    
        @page {
            size: 50mm 50mm;
            @frame content_frame {
                left: 15pt;
                top: 15pt;
                right: 15pt;
                bottom: 15pt;
            }

        }

    </style>
</head>
<body>
'''
    
    footer = '''</body></html> '''

    html_content = header  +html_content + footer
    print(html_content)
    if (os.path.isfile(pdf_file) ):
        os.remove(pdf_file)

    # Convert HTML to PDF
    #asyncio.run(html_to_pdf(html_content, pdf_file))
    # Run create_pdf_from_html
    #asyncio.get_event_loop().run_until_complete(create_pdf_from_html(html_content, 'from_html.pdf'))
    convert_html_to_pdf(html_content, pdf_file)

    # Clean up the temporary HTML file
    #os.remove(html_file)
    
    os.startfile(pdf_file)







# Example usage
markdown_file = 'docs/zatobox-one.md'
pdf_file = 'zatobox-one.pdf'
convert_markdown_to_pdf_html(markdown_file, pdf_file)

# Example usage
markdown_file = 'docs/zatobox-plug.md'
pdf_file = 'zatobox-plug.pdf'
convert_markdown_to_pdf_html(markdown_file, pdf_file)