import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
} from 'docx'
import { RewrittenCV } from '../types/cv'

/**
 * Generates an ATS-friendly DOCX buffer from a structured CV object.
 * Uses standard fonts (Calibri), no tables/columns/graphics — safe for all ATS systems.
 * Bullets use plain text indentation (no XML numbering references) for maximum ATS compatibility.
 *
 * @param cv - Structured, rewritten CV data
 * @returns Buffer containing the generated .docx file
 */
export async function generateDocx(cv: RewrittenCV): Promise<Buffer> {
  const contactParts: string[] = []
  if (cv.contact.email) contactParts.push(cv.contact.email)
  if (cv.contact.phone) contactParts.push(cv.contact.phone)
  if (cv.contact.location) contactParts.push(cv.contact.location)
  if (cv.contact.linkedin) contactParts.push(cv.contact.linkedin)
  if (cv.contact.website) contactParts.push(cv.contact.website)
  const contactLine = contactParts.join(' | ')

  const children: Paragraph[] = []

  // 1. Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: cv.contact.name,
          font: 'Calibri',
          size: 72, // 36pt = 72 half-points
          bold: true,
          color: '2E4057',
        }),
      ],
    })
  )

  // 2. Contact line
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: contactLine,
          font: 'Calibri',
          size: 20,
          color: '555555',
        }),
      ],
    })
  )

  // 3. PROFESSIONAL SUMMARY heading
  children.push(
    new Paragraph({
      spacing: { before: 360, after: 120 },
      children: [
        new TextRun({
          text: 'PROFESSIONAL SUMMARY',
          font: 'Calibri',
          size: 28,
          bold: true,
          color: '2E4057',
        }),
      ],
    })
  )

  // 4. Summary text
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: cv.summary,
          font: 'Calibri',
          size: 22,
        }),
      ],
    })
  )

  // 5. EXPERIENCE heading
  children.push(
    new Paragraph({
      spacing: { before: 360, after: 120 },
      children: [
        new TextRun({
          text: 'EXPERIENCE',
          font: 'Calibri',
          size: 28,
          bold: true,
          color: '2E4057',
        }),
      ],
    })
  )

  // 6. Experience entries
  cv.experience.forEach((entry, idx) => {
    // Job title — plain bold paragraph (no HeadingLevel to avoid ATS misparse)
    children.push(
      new Paragraph({
        spacing: { before: 240, after: 60 },
        children: [
          new TextRun({
            text: entry.title,
            font: 'Calibri',
            size: 24,
            bold: true,
            color: '2E4057',
          }),
        ],
      })
    )

    // Company | Dates | Location
    const metaParts: string[] = [entry.company, entry.dates]
    if (entry.location) metaParts.push(entry.location)
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: metaParts.join(' | '),
            font: 'Calibri',
            size: 20,
            color: '555555',
          }),
        ],
      })
    )

    // Bullets — plain text with indent (no <w:numPr> XML reference for ATS compatibility)
    entry.bullets.forEach(bullet => {
      children.push(
        new Paragraph({
          indent: { left: 360, hanging: 180 },
          children: [
            new TextRun({
              text: '\u2022  ' + bullet,
              font: 'Calibri',
              size: 22,
            }),
          ],
        })
      )
    })

    // Empty paragraph after each entry except the last
    if (idx < cv.experience.length - 1) {
      children.push(new Paragraph({ children: [] }))
    }
  })

  // 7. SKILLS heading
  children.push(
    new Paragraph({
      spacing: { before: 360, after: 120 },
      children: [
        new TextRun({
          text: 'SKILLS',
          font: 'Calibri',
          size: 28,
          bold: true,
          color: '2E4057',
        }),
      ],
    })
  )

  // 8. Skills paragraph
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: cv.skills.join(' \u2022 '),
          font: 'Calibri',
          size: 22,
        }),
      ],
    })
  )

  // 9. EDUCATION heading
  children.push(
    new Paragraph({
      spacing: { before: 360, after: 120 },
      children: [
        new TextRun({
          text: 'EDUCATION',
          font: 'Calibri',
          size: 28,
          bold: true,
          color: '2E4057',
        }),
      ],
    })
  )

  // 10. Education entries
  cv.education.forEach(entry => {
    children.push(
      new Paragraph({
        spacing: { before: 240, after: 60 },
        children: [
          new TextRun({
            text: entry.degree,
            font: 'Calibri',
            size: 24,
            bold: true,
            color: '2E4057',
          }),
        ],
      })
    )

    const eduMeta: string[] = [entry.institution, entry.dates]
    if (entry.location) eduMeta.push(entry.location)
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: eduMeta.join(' | '),
            font: 'Calibri',
            size: 20,
            color: '555555',
          }),
        ],
      })
    )

    if (entry.details) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: entry.details,
              font: 'Calibri',
              size: 22,
            }),
          ],
        })
      )
    }
  })

  // 11. Certifications
  if (cv.certifications && cv.certifications.length > 0) {
    children.push(
      new Paragraph({
        spacing: { before: 360, after: 120 },
        children: [
          new TextRun({
            text: 'CERTIFICATIONS',
            font: 'Calibri',
            size: 28,
            bold: true,
            color: '2E4057',
          }),
        ],
      })
    )

    cv.certifications.forEach(cert => {
      const certRunChildren: TextRun[] = [
        new TextRun({
          text: cert.name,
          font: 'Calibri',
          size: 22,
          bold: true,
        }),
      ]

      if (cert.issuer || cert.date) {
        const suffix = [cert.issuer, cert.date].filter(Boolean).join(' ')
        certRunChildren.push(
          new TextRun({
            text: ` \u2014 ${suffix}`,
            font: 'Calibri',
            size: 22,
          })
        )
      }

      children.push(new Paragraph({ children: certRunChildren }))
    })
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22,
          },
          paragraph: {
            spacing: { after: 100 },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 12240,
              height: 15840,
            },
            margin: {
              top: 1080,
              right: 1080,
              bottom: 1080,
              left: 1080,
            },
          },
        },
        children,
      },
    ],
  })

  return Packer.toBuffer(doc)
}
