import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  LevelFormat,
  INumberingOptions,
  HeadingLevel,
} from 'docx'
import { RewrittenCV } from '../types/cv'

function horizontalRule(): Paragraph {
  return new Paragraph({
    spacing: { before: 100, after: 100 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: '2E4057', space: 1 },
    },
    children: [],
  })
}

export async function generateDocx(cv: RewrittenCV): Promise<Buffer> {
  const numberingConfig: INumberingOptions = {
    config: [
      {
        reference: 'cv-bullets',
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: '\u2022',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: 360, hanging: 180 },
              },
            },
          },
        ],
      },
    ],
  }

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

  // 3. Horizontal rule
  children.push(horizontalRule())

  // 4. PROFESSIONAL SUMMARY heading
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
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

  // 5. Summary text
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

  // 6. Horizontal rule
  children.push(horizontalRule())

  // 7. EXPERIENCE heading
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
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

  // 8. Experience entries
  cv.experience.forEach((entry, idx) => {
    // Job title
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
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

    // Bullets
    entry.bullets.forEach(bullet => {
      children.push(
        new Paragraph({
          numbering: { reference: 'cv-bullets', level: 0 },
          children: [
            new TextRun({
              text: bullet,
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

  // 9. Horizontal rule
  children.push(horizontalRule())

  // 10. SKILLS heading
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
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

  // 11. Skills paragraph
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

  // 12. Horizontal rule
  children.push(horizontalRule())

  // 13. EDUCATION heading
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
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

  // 14. Education entries
  cv.education.forEach(entry => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
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

  // 15. Certifications
  if (cv.certifications && cv.certifications.length > 0) {
    children.push(horizontalRule())

    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
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
    numbering: numberingConfig,
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
        heading1: {
          run: {
            font: 'Calibri',
            size: 28,
            bold: true,
            color: '2E4057',
          },
          paragraph: {
            spacing: { before: 240, after: 120 },
          },
        },
        heading2: {
          run: {
            font: 'Calibri',
            size: 24,
            bold: true,
            color: '2E4057',
          },
          paragraph: {
            spacing: { before: 200, after: 80 },
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
