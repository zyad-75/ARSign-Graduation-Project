import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { initFlowbite } from 'flowbite';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { SupabaseService } from '../../../services/supabase.service';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './lessons.html',
  styleUrl: './lessons.scss',
})
export class Lessons implements OnInit {
  supabase = inject(SupabaseService);
  sanitizer = inject(DomSanitizer);
  translationService = inject(TranslationService);

  lessons: any[] = [
    {
      id: 1,
      title: 'Introduction to ArSL',
      titleAr: 'مقدمة في لغة الإشارة العربية',
      video_id: 'pqdwP578Yto',
      direct_link: 'https://youtu.be/pqdwP578Yto?si=W2x3EesW3Aj73189',
      completed: false,
      quiz: [
        {
          question: 'What is the sign for "Hello"?',
          questionAr: 'ما هي إشارة "مرحبا"؟',
          options: ['Wave hand', 'Touch nose', 'Clap hands'],
          optionsAr: ['لوح باليد', 'المس الأنف', 'صفق باليدين'],
          answer: 'Wave hand',
          answerAr: 'لوح باليد'
        },
        {
          question: 'How many letters in Arabic Sign alphabet?',
          questionAr: 'كم عدد الحروف في الأبجدية الإشارية العربية؟',
          options: ['20', '26', '28'],
          optionsAr: ['٢٠', '٢٦', '٢٨'],
          answer: '28',
          answerAr: '٢٨'
        },
        {
          question: 'Which hand do you use for signing?',
          questionAr: 'أي يد تستخدم للإشارة؟',
          options: ['Dominant Hand', 'Left Hand only', 'Right Hand only'],
          optionsAr: ['اليد المهيمنة', 'اليد اليسرى فقط', 'اليد اليمنى فقط'],
          answer: 'Dominant Hand',
          answerAr: 'اليد المهيمنة'
        },
        {
          question: 'Is ArSL the same as ASL?',
          questionAr: 'هل لغة الإشارة العربية هي نفسها الأمريكية؟',
          options: ['No, they are different', 'Yes, exactly the same', 'Only in numbers'],
          optionsAr: ['لا، فهما مختلفتان', 'نعم، هما متطابقتان تماماً', 'في الأرقام فقط'],
          answer: 'No, they are different',
          answerAr: 'لا، فهما مختلفتان'
        },
        {
          question: 'What is the most important element of sign language?',
          questionAr: 'ما هو أهم عنصر في لغة الإشارة؟',
          options: ['Hand movements only', 'Facial expressions and body language', 'Speed of signing'],
          optionsAr: ['حركات اليد فقط', 'تعابير الوجه ولغة الجسد', 'سرعة الإشارة'],
          answer: 'Facial expressions and body language',
          answerAr: 'تعابير الوجه ولغة الجسد'
        },
        {
          question: 'How many regions influence Arabic Sign Language?',
          questionAr: 'كم عدد المناطق التي تؤثر على لغة الإشارة العربية؟',
          options: ['It is universal', 'Every country has its dialect', 'Only one dialect exists'],
          optionsAr: ['هي عالمية', 'كل بلد له لهجته', 'توجد لهجة واحدة فقط'],
          answer: 'Every country has its dialect',
          answerAr: 'كل بلد له لهجته'
        },
        {
          question: 'Which hands communicate the main action in two-handed signs?',
          questionAr: 'أي يد تنقل الفعل الرئيسي في الإشارات ذات اليدين؟',
          options: ['Dominant hand', 'Non-dominant hand', 'Both equally'],
          optionsAr: ['اليد المهيمنة', 'اليد غير المهيمنة', 'كلاهما بالتساوي'],
          answer: 'Dominant hand',
          answerAr: 'اليد المهيمنة'
        },
        {
          question: 'Is Arabic Sign Language grammar the same as spoken Arabic?',
          questionAr: 'هل قواعد لغة الإشارة العربية نفس قواعد العربية المنطوقة؟',
          options: ['Yes, exactly', 'No, they have different structures', 'Only in writing'],
          optionsAr: ['نعم، بالضبط', 'لا، لهما هياكل مختلفة', 'في الكتابة فقط'],
          answer: 'No, they have different structures',
          answerAr: 'لا، لهما هياكل مختلفة'
        },
        {
          question: 'What do you do if you make a mistake while signing?',
          questionAr: 'ماذا تفعل إذا أخطأت أثناء الإشارة؟',
          options: ['Stop talking completely', 'Sign "Mistake" and correct it', 'Ignore it'],
          optionsAr: ['توقف عن الحديث تمامًا', 'أشر بـ "خطأ" وصححه', 'تجاهله'],
          answer: 'Sign "Mistake" and correct it',
          answerAr: 'أشر بـ "خطأ" وصححه'
        },
        {
          question: 'Why is it important to learn the local sign dialect?',
          questionAr: 'لماذا من المهم تعلم لهجة الإشارة المحلية؟',
          options: ['Because it is the only one', 'To communicate effectively', 'To pass a test'],
          optionsAr: ['لأنها الوحيدة', 'للتواصل الفعال بشكل أفضل', 'لاجتياز اختبار'],
          answer: 'To communicate effectively',
          answerAr: 'للتواصل الفعال بشكل أفضل'
        }
      ]
    },
    {
      id: 2,
      title: 'Arabic Finger spelling',
      titleAr: 'الهجاء الإصبعي العربي',
      video_id: 'mxHICfk1Hj0',
      direct_link: 'https://youtu.be/mxHICfk1Hj0?si=sM3QlRWI5NA6Obu1',
      completed: false,
      quiz: [
        {
          question: 'What is finger spelling?',
          questionAr: 'ما هو الهجاء الإصبعي؟',
          options: ['Signing letters', 'Signing numbers', 'Signing colors'],
          optionsAr: ['تمثيل الحروف', 'تمثيل الأرقام', 'تمثيل الألوان'],
          answer: 'Signing letters',
          answerAr: 'تمثيل الحروف'
        },
        {
          question: 'Should you bounce your hand while spelling?',
          questionAr: 'هل يجب أن تهز يدك أثناء الهجاء؟',
          options: ['No, keep it steady', 'Yes, for rhythm', 'Only for vowels'],
          optionsAr: ['لا، حافظ على ثباتها', 'نعم، من أجل الإيقاع', 'للحروف المتحركة فقط'],
          answer: 'No, keep it steady',
          answerAr: 'لا، حافظ على ثباتها'
        },
        {
          question: 'Where should your hand be positioned during finger spelling?',
          questionAr: 'أين يجب أن تكون وضعية يدك أثناء الهجاء الإصبعي؟',
          options: ['At shoulder level', 'In front of face', 'At waist level'],
          optionsAr: ['عند مستوى الكتف', 'أمام الوجه', 'عند مستوى الخصر'],
          answer: 'At shoulder level',
          answerAr: 'عند مستوى الكتف'
        },
        {
          question: 'Why is eye contact important in sign language?',
          questionAr: 'لماذا يعد التواصل البصري مهماً في لغة الإشارة؟',
          options: ['To show respect', 'To read facial expressions', 'To keep focus'],
          optionsAr: ['لإظهار الاحترام', 'لقراءة تعابير الوجه', 'للحفاظ على التركيز'],
          answer: 'To read facial expressions',
          answerAr: 'لقراءة تعابير الوجه'
        },
        {
          question: 'When is finger spelling mostly used?',
          questionAr: 'متى يُستخدم الهجاء الإصبعي غالبًا؟',
          options: ['For common verbs', 'For names of people and places', 'For emotions'],
          optionsAr: ['للأفعال الشائعة', 'لأسماء الأشخاص والأماكن', 'للمشاعر'],
          answer: 'For names of people and places',
          answerAr: 'لأسماء الأشخاص والأماكن'
        },
        {
          question: 'How do you spell a double letter like "محمد"?',
          questionAr: 'كيف تتهجى حرفًا مشددًا أو مكررًا مثل "محمد"؟',
          options: ['Sign the letter twice', 'Hold the letter longer', 'Move the letter slightly'],
          optionsAr: ['أشر للحرف مرتين', 'ثبت الحرف لفترة أطول', 'حرك الحرف قليلًا للجانب'],
          answer: 'Move the letter slightly',
          answerAr: 'حرك الحرف قليلًا للجانب'
        },
        {
          question: 'What should you avoid while finger spelling?',
          questionAr: 'ما الذي يجب تجنبه أثناء الهجاء الإصبعي؟',
          options: ['Looking at the person', 'Bouncing your hand for each letter', 'Signing clearly'],
          optionsAr: ['النظر إلى الشخص', 'هز اليد عند كل حرف', 'الإشارة بوضوح'],
          answer: 'Bouncing your hand for each letter',
          answerAr: 'هز اليد عند كل حرف'
        },
        {
          question: 'How do you indicate a space between words in spelling?',
          questionAr: 'كيف تشير إلى مسافة بين الكلمات في الهجاء؟',
          options: ['Pause briefly', 'Wave hand', 'Drop hand completely'],
          optionsAr: ['توقف مؤقتًا', 'لوح باليد', 'أنزل يدك تمامًا'],
          answer: 'Pause briefly',
          answerAr: 'توقف مؤقتًا'
        },
        {
          question: 'Where should you look when someone is finger spelling to you?',
          questionAr: 'أين يجب أن تنظر عندما يتهجى أحدهم لك؟',
          options: ['At their hands', 'At their eyes/face', 'At their shoulders'],
          optionsAr: ['إلى يديه', 'إلى عينيه/وجهه', 'إلى كتفيه'],
          answer: 'At their eyes/face',
          answerAr: 'إلى عينيه/وجهه'
        },
        {
          question: 'Is finger spelling faster or slower than normal signing?',
          questionAr: 'هل الهجاء الإصبعي أسرع أم أبطأ من الإشارة العادية؟',
          options: ['Slower', 'Faster', 'Exactly the same'],
          optionsAr: ['أبطأ', 'أسرع', 'نفس السرعة تمامًا'],
          answer: 'Slower',
          answerAr: 'أبطأ'
        }
      ]
    },
    {
      id: 3,
      title: 'Common Phrases (Greetings)',
      titleAr: 'عبارات شائعة (التحيات)',
      video_id: 'VqHCq6E6jRg',
      direct_link: 'https://youtu.be/VqHCq6E6jRg?si=_w835FX8-lsov_iW',
      completed: false,
      quiz: [
        {
          question: 'What is the sign for "Please"?',
          questionAr: 'ما هي إشارة "من فضلك"؟',
          options: ['Rub chest', 'Tap chin', 'Palm out'],
          optionsAr: ['مسح الصدر', 'النقر على الذقن', 'راحة اليد للخارج'],
          answer: 'Rub chest',
          answerAr: 'مسح الصدر'
        },
        {
          question: 'How do you ask a "Yes/No" question?',
          questionAr: 'كيف تطرح سؤال "نعم/لا"؟',
          options: ['Raise eyebrows', 'Squeeze eyes', 'Nod only'],
          optionsAr: ['رفع الحاجبين', 'غمض العينين', 'الإيماء بالرأس فقط'],
          answer: 'Raise eyebrows',
          answerAr: 'رفع الحاجبين'
        },
        {
          question: 'What is the sign for "Thank You"?',
          questionAr: 'ما هي إشارة "شكراً"؟',
          options: ['Touch chin then move forward', 'Wave goodbye', 'Clap twice'],
          optionsAr: ['لمس الذقن ثم التحرك للأمام', 'التلويح للوداع', 'التصفيق مرتين'],
          answer: 'Touch chin then move forward',
          answerAr: 'لمس الذقن ثم التحرك للأمام'
        },
        {
          question: 'How do you sign "I don\'t know"?',
          questionAr: 'كيف تشير إلى "لا أعرف"؟',
          options: ['Shrug and turn palms up', 'Shake head only', 'Point to head'],
          optionsAr: ['هز الكتفين وتوجيه الكفين للأعلى', 'هز الرأس فقط', 'الإشارة إلى الرأس'],
          answer: 'Shrug and turn palms up',
          answerAr: 'هز الكتفين وتوجيه الكفين للأعلى'
        },
        {
          question: 'Is eye contact mandatory while greeting?',
          questionAr: 'هل التواصل البصري إلزامي أثناء التحية؟',
          options: ['Yes, always', 'No, optional', 'Only with strangers'],
          optionsAr: ['نعم، دائماً', 'لا، اختياري', 'مع الغرباء فقط'],
          answer: 'Yes, always',
          answerAr: 'نعم، دائماً'
        },
        {
          question: 'What is the sign for "How are you?"',
          questionAr: 'ما هي إشارة "كيف حالك"؟',
          options: ['Point to the person and tilt hands', 'Wave and point down', 'Touch nose twice'],
          optionsAr: ['أشر للشخص ومِلْ بيديك', 'لوح وأشر للأسفل', 'المس الأنف مرتين'],
          answer: 'Point to the person and tilt hands',
          answerAr: 'أشر للشخص ومِلْ بيديك'
        },
        {
          question: 'How do you sign "Good Morning"?',
          questionAr: 'كيف تشير إلى "صباح الخير"؟',
          options: ['Sun rising gesture', 'Sleep gesture', 'Moon gesture'],
          optionsAr: ['إيماءة شروق الشمس', 'إيماءة النوم', 'إيماءة القمر'],
          answer: 'Sun rising gesture',
          answerAr: 'إيماءة شروق الشمس'
        },
        {
          question: 'What does signing "Sorry" typically involve?',
          questionAr: 'ماذا تتضمن عادة إشارة "آسف"؟',
          options: ['Rubbing a fist in a circular motion', 'Tapping the forehead', 'Clapping one time'],
          optionsAr: ['فرك قبضة اليد بحركة دائرية على الصدر', 'النقر على الجبهة', 'التصفيق مرة واحدة'],
          answer: 'Rubbing a fist in a circular motion',
          answerAr: 'فرك قبضة اليد بحركة دائرية على الصدر'
        },
        {
          question: 'Why do we nod when signing "Yes"?',
          questionAr: 'لماذا نُومئ برأسنا عند الإشارة بـ "نعم"؟',
          options: ['To emphasize the manual sign', 'To look polite', 'Because we have to'],
          optionsAr: ['للتأكيد على إشارة اليد', 'لنبدو مهذبين', 'لأننا مضطرون لذلك'],
          answer: 'To emphasize the manual sign',
          answerAr: 'للتأكيد على إشارة اليد'
        },
        {
          question: 'How do you sign "Bye"?',
          questionAr: 'كيف تشير بـ "وداعاً"؟',
          options: ['Waving the hand', 'Pointing to the door', 'Crossing arms'],
          optionsAr: ['التلويح باليد', 'الإشارة إلى الباب', 'عقد الذراعين'],
          answer: 'Waving the hand',
          answerAr: 'التلويح باليد'
        }
      ]
    }
  ];

  activeLesson: any = null;
  currentLessonIndex = 0;
  safeUrl: SafeResourceUrl | null = null;
  loading = false;

  // Quiz
  currentQuiz: any[] = [];
  userAnswers: any = {};
  quizSubmitted = false;
  score = 0;
  isQuizOpen = false;
  isReviewMode = false;
  quizAccuracy = 0;
  correctCount = 0;

  constructor() { }

  async ngOnInit() {
    this.loading = true;
    try {
      // Fetch progress if logged in
      const { data: { user } } = await this.supabase.user;
      if (user) {
        const { data: progressData } = await this.supabase.getUserProgress(user.id);
        if (progressData) {
          progressData.forEach((p: any) => {
            const lesson = this.lessons.find(l => l.id === p.lesson_id);
            if (lesson) lesson.completed = true;
          });
        }
      }

      if (this.lessons.length > 0) {
        this.selectLesson(0);
      }
    } catch (e) {
      console.error('Error fetching progress', e);
    } finally {
      this.loading = false;
      initFlowbite();
    }
  }

  selectLesson(index: number) {
    this.currentLessonIndex = index;
    this.activeLesson = this.lessons[index];
    const url = `https://www.youtube.com/embed/${this.activeLesson.video_id}`;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  async openQuiz() {
    this.isQuizOpen = true;
    this.quizSubmitted = false;
    this.userAnswers = {};
    this.currentQuiz = this.activeLesson.quiz.map((q: any) => ({ ...q, isCorrect: null }));
  }

  selectAnswer(qIndex: number, answer: string) {
    this.userAnswers[qIndex] = answer;
  }

  async submitQuiz() {
    let score = 0;
    this.currentQuiz.forEach((q, i) => {
      q.isCorrect = (this.userAnswers[i] === q.answer);
      if (q.isCorrect) {
        score++;
      }
    });

    this.score = score;
    this.correctCount = score;
    this.quizAccuracy = (score / this.currentQuiz.length) * 100;
    this.quizSubmitted = true;
    this.isReviewMode = false;

    if (this.currentQuiz.length > 0 && score >= Math.ceil(this.currentQuiz.length * 0.6)) {
      this.lessons[this.currentLessonIndex].completed = true;

      const { data: { user } } = await this.supabase.user;
      if (user) {
        await this.supabase.completeLesson(user.id, this.activeLesson.id);
      }
    }
  }

  closeQuiz() {
    this.isQuizOpen = false;
    this.isReviewMode = false;
  }
}
