import { VisualAnalysis } from '../types';

export interface ParsedAnalysisFields {
  title?: string;
  visualStyle: string;
  composition: string;
  camera: string;
  lensPerspective: string;
  lighting: string;
  colorPalette: string;
  environment: string;
  materials: string;
  subject: string;
  styling: string;
  mood: string;
  photography: string;
  usefulElements: string;
  avoid: string;
  notes: string;
}

interface FieldRule {
  key: keyof ParsedAnalysisFields;
  patterns: RegExp[];
}

const FIELD_RULES: FieldRule[] = [
  {
    key: 'visualStyle',
    patterns: [
      /^(?:visual\s+style|style|aesthetic|الستايل\s+البصري|النمط\s+البصري|الستايل|الأسلوب\s+البصري)\s*[:：\-–—]/i,
    ],
  },
  {
    key: 'composition',
    patterns: [
      /^(?:composition|framing|layout|التكوين|تكوين\s+الكادر|التأطير)\s*[:：\-–—]/i,
    ],
  },
  {
    key: 'camera',
    patterns: [
      /^(?:camera\s+angle|camera\s+perspective|camera|angle|زاوية\s+الكاميرا|الكاميرا|زاوية\s+التصوير)\s*[:：\-–—]/i,
    ],
  },
  {
    key: 'lensPerspective',
    patterns: [
      /^(?:lens\s*\/?\s*perspective|lens|focal\s+length|perspective|العدسة|البعد\s+البؤري|المنظور)\s*[:：\-–—]/i,
    ],
  },
  {
    key: 'lighting',
    patterns: [
      /^(?:lighting|light\s+setup|illumination|الإضاءة|توزيع\s+الضوء|نوع\s+الإضاءة)\s*[:：\-–—]/i,
    ],
  },
  {
    key: 'colorPalette',
    patterns: [
      /^(?:color\s+palette|colors|color\s+scheme|palette|لوحة\s+الألوان|الألوان|الدرجات\s+اللونية|درجات\s+اللون)\s*[:：\-–—]/i,
    ],
  },
  {
    key: 'environment',
    patterns: [
      /^(?:environment|setting|background|location|البيئة|المكان|الخلفية|محيط\s+التصوير)\s*[:：\-–—]/i,
    ],
  },
  {
    key: 'materials',
    patterns: [
      /^(?:materials|textures|surfaces|الخامات|الملمس|المواد|الأسطح)\s*[:：\-–—]/i,
    ],
  },
  {
    key: 'subject',
    patterns: [
      /^(?:subject|focus|model|element|الموضوع|العنصر\s+الأساسي|الموديل|المنتج\s+الرئيسي)\s*[:：\-–—]/i,
    ],
  },
  {
    key: 'styling',
    patterns: [
      /^(?:styling|wardrobe|props|props\s+and\s+styling|الستايلينج|التنسيق|الملابس|الإكسسوارات)\s*[:：\-–—]/i,
    ],
  },
  {
    key: 'mood',
    patterns: [
      /^(?:mood|atmosphere|feeling|vibe|المود|المزاج|الشعور|الأجواء|الطابع\s+العام)\s*[:：\-–—]/i,
    ],
  },
  {
    key: 'photography',
    patterns: [
      /^(?:photography|camera\s+settings|technical\s+details|التصوير\s+الفوتوغرافي|تقنية\s+التصوير|تفاصيل\s+فنية)\s*[:：\-–—]/i,
    ],
  },
  {
    key: 'usefulElements',
    patterns: [
      /^(?:useful\s+elements|key\s+elements|highlights|takeaways|عناصر\s+مفيدة|نقاط\s+قوة|أبرز\s+العناصر)\s*[:：\-–—]/i,
    ],
  },
  {
    key: 'avoid',
    patterns: [
      /^(?:things\s+to\s+avoid|avoid|what\s+to\s+avoid|do\s+not\s+use|تجنب|أشياء\s+يجب\s+تجنبها|ممنوع|لا\s+تستخدم)\s*[:：\-–—]/i,
    ],
  },
  {
    key: 'notes',
    patterns: [
      /^(?:notes|additional\s+notes|summary|ملاحظات|ملاحظات\s+إضافية|ملخص)\s*[:：\-–—]/i,
    ],
  },
];

/**
 * Parses unformatted or semi-structured analysis text from ChatGPT / Claude
 * and categorizes lines into the 14 standard Visual Analysis fields.
 */
export function parseChatGPTAnalysis(rawText: string): ParsedAnalysisFields {
  const result: ParsedAnalysisFields = {
    title: '',
    visualStyle: '',
    composition: '',
    camera: '',
    lensPerspective: '',
    lighting: '',
    colorPalette: '',
    environment: '',
    materials: '',
    subject: '',
    styling: '',
    mood: '',
    photography: '',
    usefulElements: '',
    avoid: '',
    notes: '',
  };

  if (!rawText || !rawText.trim()) return result;

  const lines = rawText.split(/\r?\n/);
  let currentField: keyof ParsedAnalysisFields | null = null;
  const buffer: Record<keyof ParsedAnalysisFields, string[]> = {
    title: [],
    visualStyle: [],
    composition: [],
    camera: [],
    lensPerspective: [],
    lighting: [],
    colorPalette: [],
    environment: [],
    materials: [],
    subject: [],
    styling: [],
    mood: [],
    photography: [],
    usefulElements: [],
    avoid: [],
    notes: [],
  };

  // First pass: extract potential title from the first header or first line
  for (let i = 0; i < Math.min(lines.length, 3); i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith('#') || trimmed.startsWith('TITLE:')) {
      result.title = trimmed.replace(/^[#\s]+/, '').replace(/^title\s*[:：\-–—]\s*/i, '').trim();
      break;
    }
  }

  for (const line of lines) {
    const cleanLine = line.trim();
    if (!cleanLine) continue;

    // Clean common Markdown markers like `**VISUAL STYLE:**` or `- VISUAL STYLE:` or `### 1. VISUAL STYLE:`
    const strippedHeading = cleanLine
      .replace(/^[#\s*\->•\d.]+\s*/, '')
      .replace(/\*\*/g, '')
      .trim();

    let matchedField: keyof ParsedAnalysisFields | null = null;
    let remainder = '';

    for (const rule of FIELD_RULES) {
      for (const pattern of rule.patterns) {
        if (pattern.test(strippedHeading)) {
          matchedField = rule.key;
          remainder = strippedHeading.replace(pattern, '').trim();
          break;
        }
      }
      if (matchedField) break;
    }

    if (matchedField) {
      currentField = matchedField;
      if (remainder) {
        buffer[currentField].push(remainder);
      }
    } else if (currentField) {
      // Continuation line for previous field
      buffer[currentField].push(cleanLine.replace(/^[*•\-]\s*/, ''));
    } else {
      // Unassigned line, push to notes or visualStyle if early
      if (!result.title && cleanLine.length < 50 && !cleanLine.includes(':')) {
        result.title = cleanLine;
      } else {
        buffer.notes.push(cleanLine);
      }
    }
  }

  // Join buffers into final string
  for (const key of Object.keys(buffer) as (keyof ParsedAnalysisFields)[]) {
    if (buffer[key].length > 0) {
      result[key] = buffer[key].join('\n').trim();
    }
  }

  return result;
}
