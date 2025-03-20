
import markdown
import os


import asyncio
from playwright.async_api import async_playwright


async def html_to_pdf(html_content, output_path, width, height):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.set_content(html_content)

        # # Inject CSS to set the margin of the page
        # await page.evaluate("""
        #     () => {
        #         const style = document.createElement('style');
        #         style.innerHTML = `
        #             body {
        #                 margin: 30px
        #             }
        #         `;
        #         document.head.appendChild(style);
        #     }
        # """)
        # # Ensure all resources are loaded
        # await page.wait_for_load_state('networkidle')
        
        # # Emulate media 
        pdf_margins = {
            'top': '4mm',
            'right': '4mm',
            'bottom': '4mm',
            'left': '4mm'
        }

        await page.pdf(path=output_path, 
                       margin=pdf_margins,
                       width=f"{width}mm", 
                       height=f"{height}mm", 
                       print_background=True,)
        await browser.close()

import re
def convert_markdown_to_pdf_html(markdown_file, pdf_file, style, width, height):
    # Read the Markdown file
    # need to install chromium with "playwright install" in command line
    with open(markdown_file, 'r', encoding='utf-8') as file:
        markdown_content = file.read()


    #custom implementaion of next page
    markdown_content = markdown_content.replace('<!--- nextpage -->', '<div class="page-break"></div>')
    #custom implementaion of next page
    index = markdown_content.find('<!--- start -->')
    markdown_content = markdown_content[index + len('<!--- start -->'):] if index != -1 else markdown_content

    ##remove all markdown links
    #pattern = re.compile(f'{re.escape('**')}.*?{re.escape('**')}')
    #pattern = re.compile(r'\[\*\*\]\(\*\*\)')
    #markdown_content = re.sub(pattern, '', markdown_content) 

    # Convert Markdown to HTML
    html_content = markdown.markdown(markdown_content, extensions=['tables'])

    #html_content = html_content.replace('src="', 'src="static')
    html_content = html_content.replace('src="', 'src="https://web-documentation.zatobox.com/')

    #html_file = "index.html"
    #with open(html_file, 'w', encoding='utf-8') as file:
    #    file.write(html_content)
    # Define the pattern to match <a href="/docs/app-info/adddevice">(Add device)</a>
    pattern = re.compile(r'<a href=".*?">\(.*?\)</a>')

    # Remove the pattern from the markdown content
    html_content = re.sub(pattern, '', html_content)

    header = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom HTML to PDF</title>
    <style>
        {style}
    </style>
</head>
<body>
"""
    
    
    footer = '''</body></html> '''

    html_content = header  +html_content + footer
    print(html_content)
    if (os.path.isfile(pdf_file) ):
        os.remove(pdf_file)

    # Convert HTML to PDF
    asyncio.run( html_to_pdf(html_content, pdf_file,  width, height))
    





# ==================================================================================================================
# ==================================================================================================================
# zatobox one quick guide


style = f"""
        .page-break {{
            page-break-before: always;
        }}    
        
        tbody {{
            font-family: 'Hervena', sans-serif;
        }}
        h1, h2, h3{{
            font-family: 'Hervena', sans-serif;
        }}
        p {{
            font-family: 'Hervena', sans-serif;
        }}

        table {{ 
            border-collapse: collapse;
            box-shadow: 0 5px 10px #E0E0E0;
            thead {{ 
                box-shadow: 0 5px 10px #E0E0E0;
            }}
            tbody {{ 
                tr:nth-child(even) {{ 
                    background: #E0E0E0;
                }}
            }}
        }}
        
        th, td {{
            padding: 4px;  
        }}

"""


# Example usage
markdown_file = 'docs/zatobox-one.md'
pdf_file = 'zatobox-one.pdf'
convert_markdown_to_pdf_html(markdown_file, pdf_file, style, 65,100)


from pypdf import PdfMerger
pdfs = ['scripts/start_zatoboxone.pdf', 'zatobox-one.pdf', 'scripts/end_zatoboxone.pdf', 'scripts/end_zatoboxone_1.pdf']
merger = PdfMerger()
for pdf in pdfs:
    merger.append(pdf)
merger.write(pdf_file)
merger.close()


os.startfile(pdf_file)




# ==================================================================================================================
# ==================================================================================================================
# zatobox plug quick guide


size = [50,50]

style = f"""
        .page-break {{
            page-break-before: always;
        }}    

        tbody {{
            font-family: 'Hervena', sans-serif;
        }}
        h1, h2, h3{{
            font-family: 'Hervena', sans-serif;
        }}
        p {{
            font-family: 'Hervena', sans-serif;
        }}
        table {{ 
            border-collapse: collapse;
            box-shadow: 0 5px 10px #E0E0E0;
            thead {{ 
                box-shadow: 0 5px 10px #E0E0E0;
            }}
            tbody {{ 
                tr:nth-child(even) {{ 
                    background: #E0E0E0;
                }}
            }}
        }}
        
        th, td {{
            padding: 4px;  
            font-size: 14px
        }}

      ol {{
        padding-left: 0; /* Remove padding */
    margin-left: 0;  /* Remove margin */
    list-style-position: inside; /* Ensure list style is inside the list item */
            }}

"""


# Example usage
markdown_file = 'docs/zatobox-plug.md'
pdf_file = 'zatobox-plug.pdf'
convert_markdown_to_pdf_html(markdown_file, pdf_file, style, 50,50)


from pypdf import PdfMerger
pdfs = ['scripts/start_zatoboxplug.pdf', 'zatobox-plug.pdf', 'scripts/end_zatoboxplug.pdf' , 'scripts/end_zatoboxplug_2.pdf', 'scripts/end_zatoboxplug_1.pdf', 'scripts/end_zatoboxplug_3.pdf']
merger = PdfMerger()
for pdf in pdfs:
    merger.append(pdf)
merger.write(pdf_file)
merger.close()


os.startfile(pdf_file)