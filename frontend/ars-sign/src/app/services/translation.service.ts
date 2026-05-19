import { Injectable, signal, WritableSignal } from '@angular/core';

export type Lang = 'en' | 'ar';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    currentLang: WritableSignal<Lang> = signal('en');

    private dictionary: Record<string, Record<Lang, string>> = {
        // Navbar & Generic
        'ArSign': { en: 'ArSign', ar: 'آرساين' },
        'Home': { en: 'Home', ar: 'الرئيسية' },
        'About Us': { en: 'About Us', ar: 'من نحن' },
        'Features': { en: 'Features', ar: 'المميزات' },
        'Our': { en: 'Our', ar: 'مميزاتنا' },
        'Choose a tool to start communicating or learning.': { en: 'Choose a tool to start communicating or learning.', ar: 'اختر أداة لبدء التواصل أو التعلم.' },
        'Text-to-Sign': { en: 'Text-to-Sign', ar: 'تحويل النص إلى إشارة' },
        'Convert written text into animated Arabic Sign Language instantly.': { en: 'Convert written text into animated Arabic Sign Language instantly.', ar: 'تحويل النص المكتوب إلى لغة إشارة عربية متحركة على الفور.' },
        'Start Now': { en: 'Start Now', ar: 'ابدأ الآن' },
        'Sign-to-Text': { en: 'Sign-to-Text', ar: 'تحويل الإشارة إلى نص' },
        'Practice your sign language skills with video lessons and quizzes.': { en: 'Practice your sign language skills with video lessons and quizzes.', ar: 'مارس مهاراتك في لغة الإشارة من خلال دروس الفيديو والاختبارات.' },
        'Log In': { en: 'Log In', ar: 'تسجيل الدخول' },
        'Sign Up': { en: 'Sign Up', ar: 'إنشاء حساب' },
        'Back': { en: 'Back', ar: 'رجوع' },
        'Profile': { en: 'Profile', ar: 'الملف الشخصي' },
        'Navigation': { en: 'Navigation', ar: 'التنقل' },
        'Back to Features': { en: 'Back to Features', ar: 'العودة للمميزات' },
        'Dictionary': { en: 'Dictionary', ar: 'القاموس' },
        'Emergency': { en: 'Emergency', ar: 'الطوارئ' },
        'ArSL Dictionary': { en: 'ArSL Dictionary', ar: 'قاموس لغة الإشارة' },
        'Explore a comprehensive library of Arabic Sign Language gestures categorized for easy learning.': { 
            en: 'Explore a comprehensive library of Arabic Sign Language gestures categorized for easy learning.', 
            ar: 'استكشف مكتبة شاملة لإيماءات لغة الإشارة العربية المصنفة لسهولة التعلم.' 
        },
        'Basics': { en: 'Basics', ar: 'الأساسيات' },
        'Family': { en: 'Family', ar: 'العائلة' },
        'Healthcare': { en: 'Healthcare', ar: 'الرعاية الصحية' },
        'Emotions': { en: 'Emotions', ar: 'المشاعر' },
        'Emergency Signs': { en: 'Emergency Signs', ar: 'إشارات الطوارئ' },
        'Quick reference for vital signs when every second counts. Learn these signs to help in urgent situations.': {
            en: 'Quick reference for vital signs when every second counts. Learn these signs to help in urgent situations.',
            ar: 'مرجع سريع للإشارات الحيوية عندما تهم كل ثانية. تعلم هذه الإشارات للمساعدة في الحالات العاجلة.'
        },

        // Home
        'Empowering Connection with': { en: 'Empowering Connection with', ar: 'تمكين التواصل مع' },
        'ProjectSummary': { 
            en: 'ArSL is an AI-driven platform engineered to process Arabic Sign Language. We proudly serve the Arab Deaf and Mute Community while empowering anyone globally to connect and communicate without barriers.', 
            ar: 'ارساين هي منصة تعمل بالذكاء الاصطناعي مصممة لمعالجة لغة الإشارة العربية. نحن نخدم بفخر مجتمع الصم والبكم العربي بينما نمكن أي شخص في جميع أنحاء العالم من التواصل بلا حواجز.' 
        },
        'Arabic Sign Language': { en: 'Arabic Sign Language', ar: 'لغة الإشارة العربية' },
        'Explore Features': { en: 'Explore Features', ar: 'استكشف المميزات' },
        'A Comprehensive Platform for the': { en: 'A Comprehensive Platform for the', ar: 'منصة متكاملة لـ' },
        'Deaf and Mute Community': { en: 'Deaf and Mute Community', ar: 'مجتمع الصم والبكم' },
        'ARsign leverages pioneering AI technology to eliminate communication barriers, offering real-time translation and accessible education all in one unified platform.': { 
            en: 'ArSign leverages pioneering AI technology to eliminate communication barriers, offering real-time translation and accessible education all in one unified platform.', 
            ar: 'تستفيد ارساين من تكنولوجيا الذكاء الاصطناعي الرائدة للقضاء على حواجز التواصل، وتقديم ترجمة فورية وتعليم ميسر في منصة واحدة موحدة.' 
        },
        'Text-to-Sign Avatar': { en: 'Text-to-Sign Avatar', ar: 'شخصية تحويل النص إلى إشارة' },
        'Translate any text into expressive 3D animated Arabic Sign Language instantly.': { en: 'Translate any text into expressive 3D animated Arabic Sign Language instantly.', ar: 'ترجم أي نص إلى لغة إشارة عربية متحركة ثلاثية الأبعاد ومعبرة على الفور.' },
        'AI Sign-to-Text': { en: 'AI Sign-to-Text', ar: 'الذكاء الاصطناعي لتحويل الإشارة إلى نص' },
        'Convert complex hand gestures into readable Arabic text in real-time using neural networks.': { en: 'Convert complex hand gestures into readable Arabic text in real-time using neural networks.', ar: 'تحويل إيماءات اليد المعقدة إلى نص عربي مقروء في الوقت الفعلي باستخدام الشبكات العصبية.' },
        'Interactive Education': { en: 'Interactive Education', ar: 'تعليم تفاعلي' },
        'Master ArSL through comprehensive video courses and interactive quizzes tailored for all levels.': { en: 'Master ArSL through comprehensive video courses and interactive quizzes tailored for all levels.', ar: 'أتقن لغة الإشارة العربية من خلال دورات فيديو شاملة واختبات تفاعلية مصممة لجميع المستويات.' },
        'The Goal of ARsign': { en: 'The Goal of ArSign', ar: 'هدف ارساين' },
        'ARsign is passionately built to transform the way we communicate. Our primary objective is to create a seamless, universally accessible environment where the Arab Deaf and Mute Community can thrive alongside everyone else. We believe that true technological advancement is measured by its ability to bring people closer together.': { 
            en: 'ArSign is passionately built to transform the way we communicate. Our primary objective is to create a seamless, universally accessible environment where the Arab Deaf and Mute Community can thrive alongside everyone else. We believe that true technological advancement is measured by its ability to bring people closer together.', 
            ar: 'تم بناء ارساين بشغف لتطوير طريقة تواصلنا. هدفنا الأساسي هو خلق بيئة سهلة الوصول للجميع حيث يمكن لمجتمع الصم والبكم العربي أن يزدهر مع الآخرين. نحن نؤمن بأن التقدم التكنولوجي الحقيقي يقاس بقدرته على تقريب الناس من بعضهم البعض.' 
        },
        'Fostering Independence': { en: 'Fostering Independence', ar: 'تعزيز الاستقلالية' },
        'By providing robust, automated translation tools, we empower individuals to navigate daily interactions, professional environments, and educational institutions with complete independence and confidence.': { 
            en: 'By providing robust, automated translation tools, we empower individuals to navigate daily interactions, professional environments, and educational institutions with complete independence and confidence.', 
            ar: 'من خلال توفير أدوات ترجمة آلية قوية، نقوم بتمكين الأفراد من التنقل في التفاعلات اليومية والبيئات المهنية والمؤسسات التعليمية باستقلالية تامة وثقة.' 
        },
        'Building a Unified Society': { en: 'Building a Unified Society', ar: 'بناء مجتمع موحد' },
        'Our technology acts as a direct bridge, closing the gap between the entire Arab world and Arabic Sign Language. We are building a society where conversational barriers simply no longer exist.': { 
            en: 'Our technology acts as a direct bridge, closing the gap between the entire Arab world and Arabic Sign Language. We are building a society where conversational barriers simply no longer exist.', 
            ar: 'تعمل تقنيتنا كجسر مباشر يسد الفجوة بين العالم العربي بأكمله ولغة الإشارة العربية. نحن نبني مجتمعاً حيث لم يعد فيه حواجز للتواصل.' 
        },
        'Pioneering AI Research': { en: 'Pioneering AI Research', ar: 'الريادة في أبحاث الذكاء الاصطناعي' },
        'We continuously push the boundaries of neural networks and computer vision to deliver the most accurate, real-time sign language recognition in the Arab world.': { 
            en: 'We continuously push the boundaries of neural networks and computer vision to deliver the most accurate, real-time sign language recognition in the Arab world.', 
            ar: 'نحن ندفع باستمرار حدود الشبكات العصبية والرؤية الحاسوبية لتقديم التعرف على لغة الإشارة الأكثر دقة في الوقت الفعلي في العالم العربي.' 
        },
        'Explore Our': { en: 'Explore Our', ar: 'استكشف' },
        'Campaigns': { en: 'Campaigns', ar: 'حملات' },
        'Active': { en: 'Active', ar: 'نشط' },
        'Upcoming': { en: 'Upcoming', ar: 'قادم' },
        'Sign Language Basics Workshop': { en: 'Sign Language Basics Workshop', ar: 'ورشة عمل أساسيات لغة الإشارة' },
        'WorkshopDescription': {
            en: 'Join us for a free introductory workshop to learn the alphabet and common daily signs.',
            ar: 'انضم إلينا في ورشة عمل تمهيدية مجانية لتعلم الأبجدية والإشارات اليومية الشائعة.'
        },
        'Deaf Awareness Week': { en: 'Deaf Awareness Week', ar: 'أسبوع التوعية بالصم' },
        'AwarenessDescription': {
            en: 'A week dedicated to raising awareness about Deaf and Mute culture and promoting inclusivity in our community.',
            ar: 'أسبوع مخصص لرفع الوعي حول ثقافة الصم والبكم وتعزيز الشمولية في مجتمعنا.'
        },
        'Join Event': { en: 'Join Event', ar: 'انضم للحدث' },
        'Inclusive Workplace Seminar': { en: 'Inclusive Workplace Seminar', ar: 'ندوة مكان العمل الشامل' },
        'SeminarDescription': { en: 'Learn how to make your professional environment more accessible for Deaf and Mute employees.', ar: 'تعلم كيفية جعل بيئتك المهنية أكثر سهولة في الوصول للموظفين الصم والبكم.' },
        'Sign-Tech Hackathon': { en: 'Sign-Tech Hackathon', ar: 'هاكاثون تكنولوجيا الإشارة' },
        'HackathonDescription': { en: 'A 48-hour challenge to build innovative solutions for the Deaf and Mute community.', ar: 'تحدي لمدة 48 ساعة لبناء حلول مبتكرة لمجتمع الصم والبكم.' },
        'Register Hub': { en: 'Register Hub', ar: 'مركز التسجيل' },
        'View All Campaigns': { en: 'View All Campaigns', ar: 'عرض جميع الحملات' },

        // About Us
        'Breaking': { en: 'Breaking', ar: 'كسر' },
        'Communication Barriers': { en: 'Communication Barriers', ar: 'حواجز التواصل' },
        'For the Arab Deaf and Mute Community': { en: 'For the Arab Deaf and Mute Community', ar: 'لمجتمع الصم والبكم العربي' },
        'Arabic Sign Language (ArSL) support has long been overlooked. ARsign bridges this gap by providing an AI-driven platform engineered to process Arabic Sign Language. We proudly serve the Arab Deaf and Mute Community while empowering anyone globally to connect and communicate without barriers.': { 
            en: 'Arabic Sign Language (ArSL) support has long been overlooked. ArSign bridges this gap by providing an AI-driven platform engineered to process Arabic Sign Language. We proudly serve the Arab Deaf and Mute Community while empowering anyone globally to connect and communicate without barriers.', 
            ar: 'لطالما تم إهمال دعم لغة الإشارة العربية. تسد ارساين هذه الفجوة من خلال توفير منصة تركز على الذكاء الاصطناعي ومصممة لمعالجة لغة الإشارة العربية. نحن نخدم بفخر مجتمع الصم والبكم العربي بينما نمكن أي شخص على مستوى العالم من التواصل بدون حواجز.' 
        },
        '95%+': { en: '95%+', ar: '+٩٥٪' },
        'Accuracy': { en: 'Accuracy', ar: 'الدقة' },
        'Real-time': { en: 'Real-time', ar: 'في الوقت الفعلي' },
        'Speed': { en: 'Speed', ar: 'السرعة' },
        'Our Mission': { en: 'Our Mission', ar: 'مهمتنا' },
        'To universally empower the Arab Deaf and Mute Community through innovation.': { en: 'To universally empower the Arab Deaf and Mute Community through innovation.', ar: 'تمكين مجتمع الصم والبكم العربي عالميًا من خلال الابتكار.' },
        'Our Core Values': { en: 'Our Core Values', ar: 'قيمنا الأساسية' },
        'Accessibility First': { en: 'Accessibility First', ar: 'إمكانية الوصول أولاً' },
        'We prioritize barrier-free access. Our designs and algorithms are rigorously validated with the Deaf community to ensure a seamless, fully inclusive user experience for everyone.': { en: 'We prioritize barrier-free access. Our designs and algorithms are rigorously validated with the Deaf community to ensure a seamless, fully inclusive user experience for everyone.', ar: 'نحن نعطي الأولوية للوصول الخالي من العوائق. يتم التحقق من صحة تصميماتنا وخوارزمياتنا بدقة مع مجتمع الصم لضمان تجربة مستخدم سلسة وشاملة للجميع.' },
        'Continuous Innovation': { en: 'Continuous Innovation', ar: 'الابتكار المستمر' },
        'Technology never stands still, and neither do we. We continuously refine our computer vision models to accurately capture and interpret the subtle nuances of human expression.': { 
            en: 'Technology never stands still, and neither do we. We continuously refine our computer vision models to accurately capture and interpret the subtle nuances of human expression.', 
            ar: 'التكنولوجيا لا تتوقف أبداً، ونحن أيضاً. نقوم باستمرار بتحسين نماذج الرؤية الحاسوبية لدينا لالتقاط وتفسير الفروق الدقيقة في التعبير البشري بدقة.' 
        },
        'Community Led': { en: 'Community Led', ar: 'بقيادة المجتمع' },
        'Built directly alongside Deaf advocates and linguistic experts, ensuring that ARsign is authentically rooted in cultural nuances and delivers meaningful real-world impact.': { en: 'Built directly alongside Deaf advocates and linguistic experts, ensuring that ArSign is authentically rooted in cultural nuances and delivers meaningful real-world impact.', ar: 'تم بناؤه مباشرة إلى جانب المدافعين عن الصم وخبراء اللغة، مما يضمن تجذر ارساين بشكل أصيل في الفروق الثقافية وتقديم تأثير واقعي ذو مغزى.' },
        'Empowering the Arab Deaf and Mute Community': { en: 'Empowering the Arab Deaf and Mute Community', ar: 'تمكين مجتمع الصم والبكم العربي' },
        'ARsign is not just a technological platform; it is a profound commitment to humanity. We passionately built this website to be a lifeline that truly helps people connect, learn, and express themselves without boundaries. It is a comprehensive platform meticulously engineered explicitly for Arab Deaf and Mute people. Furthermore, the world is borderless, and Arab Deaf and Mute individuals exist in every country; therefore, anyone across the globe can utilize ARsign to seamlessly communicate and dissolve everyday conversational barriers.': { 
            en: 'ArSign is not just a technological platform; it is a profound commitment to humanity. We passionately built this website to be a lifeline that truly helps people connect, learn, and express themselves without boundaries. It is a comprehensive platform meticulously engineered explicitly for Arab Deaf and Mute people. Furthermore, the world is borderless, and Arab Deaf and Mute individuals exist in every country; therefore, anyone across the globe can utilize ArSign to seamlessly communicate and dissolve everyday conversational barriers.', 
            ar: 'ارساين ليس مجرد منصة تكنولوجية؛ إنه التزام عميق تجاه الإنسانية. لقد قمنا ببناء هذا الموقع بشغف ليكون شريان حياة يساعد الناس حقًا على التواصل والتعلم والتعبير عن أنفسهم بلا حدود. إنها منصة شاملة صُممت بدقة خصيصاً للصم والبكم العرب. علاوة على ذلك، العالم بلا حدود، ويوجد أفراد من الصم والبكم العرب في كل دولة؛ لذلك، يمكن لأي شخص في جميع أنحاء العالم استخدام ارساين للتواصل بسلاسة وإزالة حواجز المحادثة اليومية.' 
        },
        'Instant Sign-to-Text translation via AI Camera': { en: 'Instant Sign-to-Text translation via AI Camera', ar: 'ترجمة فورية من الإشارة إلى نص عبر كاميرا الذكاء الاصطناعي' },
        'Seamless Text-to-Sign animated avatars': { en: 'Seamless Text-to-Sign animated avatars', ar: 'شخصيات متحركة سلسة لتحويل النص إلى إشارة' },
        'Interactive educational lessons for learners': { en: 'Interactive educational lessons for learners', ar: 'دروس تعليمية تفاعلية للمتعلمين' },
        'Technology reaches its true potential only when it works for everyone.': { en: 'Technology reaches its true potential only when it works for everyone.', ar: 'تصل التكنولوجيا إلى إمكاناتها الحقيقية فقط عندما تعمل من أجل الجميع.' },
        'ARsign Development Team': { en: 'ArSign Development Team', ar: 'فريق تطوير ارساين' },
        'Join Our': { en: 'Join Our', ar: 'انضم إلى' },
        'Community Campaigns': { en: 'Community Campaigns', ar: 'حملات المجتمع' },

        // Profile
        'Member since': { en: 'Member since', ar: 'عضو منذ' },
        'Edit Profile': { en: 'Edit Profile', ar: 'تعديل الملف الشخصي' },
        'Save Changes': { en: 'Save Changes', ar: 'حفظ التغييرات' },
        'Dashboard': { en: 'Dashboard', ar: 'لوحة التحكم' },
        'My Progress': { en: 'My Progress', ar: 'تقدمي' },
        'Overall Stats': { en: 'Overall Stats', ar: 'الإحصائيات العامة' },
        'Lessons': { en: 'Lessons', ar: 'الدروس' },
        'Quiz Score': { en: 'Quiz Score', ar: 'درجة الاختبار' },
        'Daily Streak': { en: 'Daily Streak', ar: 'السلسلة اليومية' },
        'Personal Details': { en: 'Personal Details', ar: 'التفاصيل الشخصية' },
        'Verified': { en: 'Verified', ar: 'موثق' },
        'Full Name': { en: 'Full Name', ar: 'الاسم الكامل' },
        'First Name': { en: 'First Name', ar: 'الاسم الأول' },
        'Last Name': { en: 'Last Name', ar: 'اسم العائلة' },
        'Email Address': { en: 'Email Address', ar: 'البريد الإلكتروني' },
        'Phone Number': { en: 'Phone Number', ar: 'رقم الهاتف' },
        'Location': { en: 'Location', ar: 'الموقع' },
        'Language Preference': { en: 'Language Preference', ar: 'تفضيل اللغة' },
        'Arabic (العربية)': { en: 'Arabic (العربية)', ar: 'العربية (العربية)' },
        'English (اللغة الإنجليزية)': { en: 'English (اللغة الإنجليزية)', ar: 'الإنجليزية (اللغة الإنجليزية)' },
        'Specific Needs': { en: 'Specific Needs', ar: 'الاحتياجات الخاصة' },
        'Can you hear?': { en: 'Can you hear?', ar: 'هل يمكنك السمع؟' },
        'Can you speak?': { en: 'Can you speak?', ar: 'هل يمكنك التحدث؟' },
        'Yes': { en: 'Yes', ar: 'نعم' },
        'No': { en: 'No', ar: 'لا' },
        'Translation History': { en: 'Translation History', ar: 'سجل الترجمة' },
        'No history yet. Start translating!': { en: 'No history yet. Start translating!', ar: 'لا يوجد سجل ترجمة بعد. ابدأ الآن!' },
        'Active Licenses': { en: 'Active Licenses', ar: 'التراخيص النشطة' },
        'Expires': { en: 'Expires', ar: 'تنتهي في' },
        'No active licenses. Visit the shop to get started!': { en: 'No active licenses. Visit the shop to get started!', ar: 'لا توجد تراخيص نشطة. قم بزيارة المتجر للبدء!' },
        'Security': { en: 'Security', ar: 'الأمان' },
        'Manage your password': { en: 'Manage your password', ar: 'إدارة كلمة المرور' },
        'Sign Out': { en: 'Sign Out', ar: 'تسجيل الخروج' },
        'End session securely': { en: 'End session securely', ar: 'إنهاء الجلسة بشكل آمن' },

        // Feature Pages: Sign-to-Text & Text-to-Sign
        'Live Vision AI': { en: 'Live Vision AI', ar: 'الرؤية الحاسوبية المباشرة' },
        'Camera Feed': { en: 'Camera Feed', ar: 'بث الكاميرا' },
        'Please start camera to begin translation': { en: 'Please start camera to begin translation', ar: 'يرجى تشغيل الكاميرا لبدء الترجمة' },
        'Start Camera': { en: 'Start Camera', ar: 'تشغيل الكاميرا' },
        'Stop Camera': { en: 'Stop Camera', ar: 'إيقاف الكاميرا' },
        'Start Streaming': { en: 'Start Streaming', ar: 'بدء البث' },
        'Stop Streaming': { en: 'Stop Streaming', ar: 'إيقاف البث' },
        'Translate sign language gestures into written text with our AI camera.': { en: 'Translate sign language gestures into written text with our AI camera.', ar: 'ترجم إيماءات لغة الإشارة إلى نص مكتوب باستخدام كاميرا الذكاء الاصطناعي الخاصة بنا.' },
        'TEXT': { en: 'TEXT', ar: 'نص' },
        'Waiting for a sign to be detected...': { en: 'Waiting for a sign to be detected...', ar: 'في انتظار اكتشاف إشارة...' },
        'Enter Text': { en: 'Enter Text', ar: 'أدخل النص' },
        'Type here to convert to sign language...': { en: 'Type here to convert to sign language...', ar: 'اكتب هنا للتحويل إلى لغة الإشارة...' },
        'Translating...': { en: 'Translating...', ar: 'جاري الترجمة...' },
        'Signing:': { en: 'Signing:', ar: 'جاري الإشارة:' },
        'Waiting for input...': { en: 'Waiting for input...', ar: 'في انتظار الإدخال...' },
        'Real-time translation from Arabic Sign Language into readable text using our advanced AI models.': { 
            en: 'Real-time translation from Arabic Sign Language into readable text using our advanced AI models.', 
            ar: 'ترجمة فورية من لغة الإشارة العربية إلى نص مقروء باستخدام نماذج الذكاء الاصطناعي المتقدمة لدينا.' 
        },
        'Translation': { en: 'Translation', ar: 'الترجمة' },
        'Clear': { en: 'Clear', ar: 'مسح' },
        'Save to History': { en: 'Save to History', ar: 'حفظ في السجل' },
        'Or translate from a pre-recorded video:': { en: 'Or translate from a pre-recorded video:', ar: 'أو ترجم من فيديو مسجل مسبقاً:' },
        'Translate': { en: 'Translate', ar: 'ترجم' },
        'Submit': { en: 'Submit', ar: 'إرسال' },
        'Avatar': { en: 'Avatar', ar: 'الشخصية الافتراضية' },
        'Convert Arabic Sign Language (ArSL) text into 3D animations.': { 
            en: 'Convert Arabic Sign Language (ArSL) text into 3D animations.', 
            ar: 'تحويل نص لغة الإشارة العربية إلى رسوم متحركة ثلاثية الأبعاد.' 
        },
        'Feedback': { en: 'Feedback', ar: 'الآراء والمقترحات' },
        'We value your feedback': { en: 'We value your feedback', ar: 'نحن نقدر ملاحظاتكم' },
        'Message': { en: 'Message', ar: 'الرسالة' },
        'Your feedback...': { en: 'Your feedback...', ar: 'رأيكم ومقترحاتكم...' },
        'Submit Feedback': { en: 'Submit Feedback', ar: 'إرسال الرأي' },
        'Thank you for your feedback!': { en: 'Thank you for your feedback!', ar: 'شكراً لملاحظاتكم!' },
        'Sending...': { en: 'Sending...', ar: 'جاري الإرسال...' },
        'Video Lesson': { en: 'Video Lesson', ar: 'درس فيديو' },
        'Having trouble with the video?': { en: 'Having trouble with the video?', ar: 'هل تواجه مشكلة في الفيديو؟' },
        'Watch on YouTube': { en: 'Watch on YouTube', ar: 'شاهد على يوتيوب' },
        'Take Quiz!': { en: 'Take Quiz!', ar: 'ابدأ الاختبار!' },
        'Select a lesson to start': { en: 'Select a lesson to start', ar: 'اختر درساً للبدء' },
        'Quiz': { en: 'Quiz', ar: 'اختبار' },
        'Test Your Knowledge': { en: 'Test Your Knowledge', ar: 'اختبر معلوماتك' },
        'Correct Answer': { en: 'Correct Answer', ar: 'الإجابة الصحيحة' },
        'Your Answer (Correct)': { en: 'Your Answer (Correct)', ar: 'إجابتك (صحيحة)' },
        'Your Answer (Incorrect)': { en: 'Your Answer (Incorrect)', ar: 'إجابتك (خاطئة)' },
        'Great Job!': { en: 'Great Job!', ar: 'عمل رائع!' },
        'Keep Practicing!': { en: 'Keep Practicing!', ar: 'استمر في الممارسة!' },
        'Score': { en: 'Score', ar: 'النتيجة' },
        'Review your answers': { en: 'Review your answers', ar: 'راجع إجاباتك' },
        'Submit Answers': { en: 'Submit Answers', ar: 'إرسال الإجابات' },
        'Close': { en: 'Close', ar: 'إغلاق' },
        'Back to Results': { en: 'Back to Results', ar: 'العودة للنتائج' },
        'Completed': { en: 'Completed', ar: 'مكتمل' },

        // Footer & Extras
        'FooterDescription': { en: 'AI-Powered Sign Language Translation & Learning Platform. Bridging communication gaps one sign at a time.', ar: 'منصة ترجمة وتعليم لغة الإشارة المدعومة بالذكاء الاصطناعي. نسد فجوات التواصل إشارة تلو الأخرى.' },
        'QuickLinks': { en: 'Quick Links', ar: 'روابط سريعة' },
        'Resources': { en: 'Resources', ar: 'الموارد' },
        'Subscribe': { en: 'Subscribe to Newsletter', ar: 'اشترك في النشرة الإخبارية' },
        'EmailPlaceholder': { en: 'Enter your email', ar: 'أدخل بريدك الإلكتروني' },
        'Community': { en: 'Community', ar: 'المجتمع' },
        'JoinNow': { en: 'Join Now', ar: 'انضم الآن' },
        'Stay updated with our latest tools and events.': { 
            en: 'Stay updated with our latest tools and events.', 
            ar: 'ابق على اطلاع بأحدث أدواتنا وفعالياتنا.' 
        },
        'About ARsign': { en: 'About ArSign', ar: 'حول ارساين' },
        'Privacy Policy': { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
        'Terms & Conditions': { en: 'Terms & Conditions', ar: 'الشروط والأحكام' },
        'All Rights Reserved': { en: 'All Rights Reserved', ar: 'جميع الحقوق محفوظة' },
        'Learn More': { en: 'Learn More', ar: 'اعرف المزيد' }
    };

    constructor() {
        // Helper to toggle lang
    }

    setLang(lang: Lang) {
        this.currentLang.set(lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }

    toggleLang() {
        this.setLang(this.currentLang() === 'en' ? 'ar' : 'en');
    }

    translate(key: string): string {
        const entry = this.dictionary[key];
        if (entry) {
            return entry[this.currentLang()] || key;
        }
        return key; // Fallback to key if not found
    }
}
