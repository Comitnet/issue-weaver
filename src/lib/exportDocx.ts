import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { Magazine } from '@/types/magazine';

export async function exportMagazineAsDocx(magazine: Magazine): Promise<Blob> {
  const children: Paragraph[] = [];

  // Cover page content
  children.push(
    new Paragraph({
      text: magazine.title,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: `Issue ${magazine.issueNumber}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: magazine.subtitle || '',
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  if (magazine.tagline) {
    children.push(
      new Paragraph({
        text: magazine.tagline,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );
  }

  // Contents
  children.push(
    new Paragraph({
      text: 'Contents',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    })
  );

  magazine.sections.forEach((section, idx) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${idx + 1}. `, bold: true }),
          new TextRun({ text: section.title }),
          new TextRun({ text: section.subtitle ? ` - ${section.subtitle}` : '' }),
        ],
        spacing: { after: 100 },
      })
    );
  });

  // Articles
  magazine.sections.forEach((section) => {
    if (section.kind === 'advertisement') {
      children.push(
        new Paragraph({
          text: '[ADVERTISEMENT]',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        })
      );
      if (section.adHeadline) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: section.adHeadline, bold: true })],
            spacing: { after: 200 },
          })
        );
      }
      if (section.adBody) {
        children.push(
          new Paragraph({
            text: section.adBody,
            spacing: { after: 200 },
          })
        );
      }
      return;
    }

    // Article section
    children.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      })
    );

    if (section.subtitle) {
      children.push(
        new Paragraph({
          text: section.subtitle,
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 200 },
        })
      );
    }

    const body = section.bodyMarkdown || '';
    const paragraphs = body
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    paragraphs.forEach((para) => {
      children.push(
        new Paragraph({
          text: para,
          spacing: { after: 200 },
        })
      );
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
