import { Injectable } from '@angular/core';

export interface SignAction {
  type: 'word' | 'char' | 'pause';
  value: string; // The URL or Clip Name
  label: string; // The display text
}

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  // Available RobotExpressive animations:
  // Dance, Death, Idle, Jump, No, Punch, Running, Sitting, Standing, ThumbsUp, Walking, Wave, WalkJump, Yes

  // Mapping of Arabic words to RobotExpressive gesture animations
  private wordDictionary: { [key: string]: string } = {
    // === التحيات (Greetings) ===
    'السلام عليكم': 'sentence_assalamu_alaikum',
    'السلام': 'Wave',
    'عليكم': 'Wave',
    'عليكوا': 'Wave',
    'مرحبا': 'Wave',
    'اهلا': 'Wave',
    'صباح': 'Wave',
    'الخير': 'ThumbsUp',
    'مساء': 'Wave',
    'النور': 'ThumbsUp',

    // === الوداع (Farewell) ===
    'مع': 'Standing',
    'السلامه': 'Wave',
    'باي': 'Wave',
    'الي': 'Standing',
    'اللقاء': 'Wave',

    // === الموافقة والإيجاب (Agreement) ===
    'نعم': 'Yes',
    'ايوه': 'Yes',
    'اه': 'Yes',
    'تمام': 'ThumbsUp',
    'كويس': 'ThumbsUp',
    'ممتاز': 'ThumbsUp',
    'حلو': 'ThumbsUp',
    'صح': 'Yes',
    'موافق': 'Yes',
    'اوكي': 'ThumbsUp',
    'حاضر': 'Yes',
    'ماشي': 'Yes',

    // === الرفض والنفي (Disagreement) ===
    'لا': 'assets/animations/letters/laa.glb',
    'لاء': 'No',
    'مش': 'No',
    'مفيش': 'No',
    'غلط': 'No',
    'ابدا': 'No',
    'رفض': 'No',
    'مينفعش': 'No',

    // === المشاعر الإيجابية (Positive emotions) ===
    'شكرا': 'ThumbsUp',
    'فرحان': 'Dance',
    'سعيد': 'Dance',
    'مبسوط': 'Dance',
    'حب': 'ThumbsUp',
    'بحبك': 'Dance',
    'عظيم': 'Jump',
    'رائع': 'Jump',
    'جميل': 'ThumbsUp',
    'يلا': 'Jump',
    'هيا': 'Jump',

    // === الأفعال (Actions) ===
    'تعالي': 'Wave',
    'امشي': 'Walking',
    'اجري': 'Running',
    'اقعد': 'Sitting',
    'اوقف': 'Standing',
    'قوم': 'Standing',
    'انزل': 'Sitting',
    'روح': 'Walking',
    'ارقص': 'Dance',
    'نط': 'Jump',

    // === الأسئلة (Questions) ===
    'ازيك': 'Wave',
    'ازاي': 'Standing',
    'فين': 'Standing',
    'مين': 'Standing',
    'ليه': 'Standing',
    'امتي': 'Standing',
    'ايه': 'Standing',
    'عامل': 'Wave',

    // === كلمات شائعة (Common words) ===
    'انا': 'assets/animations/words/ana.glb',
    'انت': 'Standing',
    'احنا': 'Standing',
    'هو': 'Standing',
    'هي': 'Standing',
    'كبير': 'Jump',
    'صغير': 'Sitting',
    'كتير': 'Dance',
    'شويه': 'Idle',
    'عايز': 'Standing',
    'محتاج': 'Standing',

    // === جمل جديدة (New Sentences) ===
    'ما اسمك': 'sentence_ma_ismak',
    'كم عمرك': 'sentence_kam_umrak',
    'انا اذهب الي المدرسه': 'sentence_ana_athhab_almadrasah',

    // === المدرسة والتعليم (School) ===
    'مدرسه': 'Walking',
    'المدرسه': 'Walking',
    'درس': 'Sitting',
    'كتاب': 'Standing',
    'معلم': 'Standing',
    'استاذ': 'Wave',
    'امتحان': 'Sitting',
    'ذهب': 'Walking',

    // === العائلة (Family) ===
    'ابي': 'Wave',
    'امي': 'Wave',
    'اخي': 'Wave',
    'اختي': 'Wave',
    'عائله': 'Dance',
    'بيت': 'Standing',
    'اصحابي': 'Wave',
    'صاحبي': 'Wave',
  };

  // Mapping of Arabic characters to external GLB animations
  private charDictionary: { [key: string]: string } = {
    'ا': 'assets/animations/letters/alf.glb',
    'ب': 'assets/animations/letters/beh.glb',
    'ت': 'assets/animations/letters/teh.glb',
    'ث': 'assets/animations/letters/theh.glb',
    'ج': 'assets/animations/letters/jeem.glb',
    'ح': 'assets/animations/letters/haah.glb',
    'خ': 'assets/animations/letters/khah.glb',
    'د': 'assets/animations/letters/dal.glb',
    'ذ': 'assets/animations/letters/thal.glb',
    'ر': 'assets/animations/letters/reh.glb',
    'ز': 'assets/animations/letters/zain.glb',
    'س': 'assets/animations/letters/seen.glb',
    'ش': 'assets/animations/letters/sheen.glb',
    'ص': 'assets/animations/letters/sad.glb',
    'ض': 'assets/animations/letters/dad.glb',
    'ط': 'assets/animations/letters/tah.glb',
    'ظ': 'assets/animations/letters/zah.glb',
    'ع': 'assets/animations/letters/ain.glb',
    'غ': 'assets/animations/letters/ghain.glb',
    'ف': 'assets/animations/letters/feh.glb',
    'ق': 'assets/animations/letters/qaf.glb',
    'ك': 'assets/animations/letters/kaf.glb',
    'ل': 'assets/animations/letters/lam.glb',
    'م': 'assets/animations/letters/meem.glb',
    'ن': 'assets/animations/letters/noon.glb',
    'ه': 'assets/animations/letters/heeh.glb',
    'و': 'assets/animations/letters/woow.glb',
    'ي': 'assets/animations/letters/yeeh.glb',
    'لا': 'assets/animations/letters/laa.glb',
  };

  /**
   * Normalizes Arabic text by removing diacritics (Tashkeel)
   */
  normalizeText(text: string): string {
    return text
      .replace(/[ًٌٍَُِّْـ]/g, '') // Remove Tashkeel and Tatweel
      .replace(/[إأآا]/g, 'ا')     // Standardize Alif
      .replace(/[يى]/g, 'ي')       // Standardize Yeh
      .replace(/[ة]/g, 'ه')       // Standardize Teh Marbuta
      .trim();
  }

  /**
   * Converts input text into a sequence of sign actions
   */
  getTextSequence(text: string): SignAction[] {
    const normalized = this.normalizeText(text);
    const words = normalized.split(/\s+/);
    const sequence: SignAction[] = [];

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      let phraseMatched = false;

      // Check for 2-word phrases first
      if (i < words.length - 1) {
        const twoWords = word + ' ' + words[i + 1];
        if (this.wordDictionary[twoWords]) {
          sequence.push({
            type: 'word',
            value: this.wordDictionary[twoWords],
            label: twoWords
          });
          sequence.push({ type: 'pause', value: 'idle', label: 'space' });
          i++; // Skip next word as it's part of the phrase
          phraseMatched = true;
          continue;
        }
      }

      if (!phraseMatched) {
        if (this.wordDictionary[word]) {
          // Full word sign found
          sequence.push({
            type: 'word',
            value: this.wordDictionary[word],
            label: word
          });
        } else {
          // Fallback: spell it out character by character
          for (const char of word) {
            const charValue = this.charDictionary[char] || 'assets/animations/letters/unknown.glb';
            sequence.push({
              type: 'char',
              value: charValue,
              label: char
            });
          }
        }
        // Add a small pause between words
        sequence.push({ type: 'pause', value: 'idle', label: 'space' });
      }
    }

    return sequence;
  }
}
