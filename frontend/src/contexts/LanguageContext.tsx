import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'kn';

interface Translations {
  [key: string]: {
    [K in Language]: string;
  };
}

export const translations: Translations = {
  // Navbar
  nav_home: { en: 'Home', hi: 'होम', kn: 'ಮನೆ' },
  nav_about: { en: 'About', hi: 'हमारे बारे में', kn: 'ನಮ್ಮ ಬಗ್ಗೆ' },
  nav_features: { en: 'Features', hi: 'विशेषताएं', kn: 'ವೈಶಿಷ್ಟ್ಯಗಳು' },
  nav_product: { en: 'Product', hi: 'उत्पाद', kn: 'ಉತ್ಪನ್ನ' },
  nav_pricing: { en: 'Pricing', hi: 'मूल्य निर्धारण', kn: 'ಬೆಲೆ' },
  nav_faq: { en: 'FAQ', hi: 'सामान्य प्रश्न', kn: 'FAQ' },
  nav_get_started: { en: 'Get Started', hi: 'शुरू करें', kn: 'ಪ್ರಾರಂಭಿಸಿ' },
  nav_login: { en: 'Login', hi: 'लॉगिन', kn: 'ಲಾಗಿನ್' },

  // Hero
  hero_title: { en: 'Access Your Complete Medical History Anytime', hi: 'अपना पूरा चिकित्सा इतिहास कभी भी एक्सेस करें', kn: 'ನಿಮ್ಮ ಸಂಪೂರ್ಣ ವೈದ್ಯಕೀಯ ಇತಿಹಾಸವನ್ನು ಯಾವಾಗ ಬೇಕಾದರೂ ಪ್ರವೇಶಿಸಿ' },
  hero_subtitle: { en: 'Store records, track health, and access critical medical data instantly — anytime, anywhere.', hi: 'रिकॉर्ड स्टोर करें, स्वास्थ्य को ट्रैक करें और महत्वपूर्ण चिकित्सा डेटा को तुरंत एक्सेस करें - कभी भी, कहीं भी।', kn: 'ದಾಖಲೆಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ, ಆರೋಗ್ಯವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ಮತ್ತು ನಿರ್ಣಾಯಕ ವೈದ್ಯಕೀಯ ಡೇಟಾವನ್ನು ತಕ್ಷಣವೇ ಪ್ರವೇಶಿಸಿ - ಯಾವಾಗ ಬೇಕಾದರೂ, ಎಲ್ಲಿ ಬೇಕಾದರೂ.' },
  hero_records_count: { en: '50,000+ medical records securely stored', hi: '50,000+ चिकित्सा रिकॉर्ड सुरक्षित रूप से संग्रहीत', kn: '50,000+ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ' },
  hero_watch_demo: { en: 'Watch Demo', hi: 'डेमो देखें', kn: 'ಡೆಮೊ ವೀಕ್ಷಿಸಿ' },

  // Role Selection
  role_title: { en: 'Choose Your Portal', hi: 'अपना पोर्टल चुनें', kn: 'ನಿಮ್ಮ ಪೋರ್ಟಲ್ ಆಯ್ಕೆಮಾಡಿ' },
  role_subtitle: { en: 'Select how you want to access BioVita', hi: 'चुनें कि आप BioVita को कैसे एक्सेस करना चाहते हैं', kn: 'ನೀವು BioVita ಅನ್ನು ಹೇಗೆ ಪ್ರವೇಶಿಸಲು ಬಯಸುತ್ತೀರಿ ಎಂಬುದನ್ನು ಆಯ್ಕೆಮಾಡಿ' },
  role_patient: { en: 'Patient', hi: 'मरीज', kn: 'ರೋಗಿ' },
  role_patient_desc: { en: 'Manage your medical records, upload reports, and access your health history anytime.', hi: 'अपने चिकित्सा रिकॉर्ड प्रबंधित करें, रिपोर्ट अपलोड करें और कभी भी अपने स्वास्थ्य इतिहास तक पहुंचें।', kn: 'ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ, ವರದಿಗಳನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ನಿಮ್ಮ ಆರೋಗ್ಯ ಇತಿಹಾಸವನ್ನು ಪ್ರವೇಶಿಸಿ.' },
  role_doctor: { en: 'Doctor', hi: 'डॉक्टर', kn: 'ವೈದ್ಯರು' },
  role_doctor_desc: { en: 'Access patient records, review medical history, and provide insights.', hi: 'मरीज के रिकॉर्ड तक पहुंचें, चिकित्सा इतिहास की समीक्षा करें और अंतर्दृष्टि प्रदान करें।', kn: 'ರೋಗಿಯ ದಾಖಲೆಗಳನ್ನು ಪ್ರವೇಶಿಸಿ, ವೈದ್ಯಕೀಯ ಇತಿಹಾಸವನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಒಳನೋಟಗಳನ್ನು ನೀಡಿ.' },
  role_continue_patient: { en: 'Continue as Patient', hi: 'मरीज के रूप में जारी रखें', kn: 'ರೋಗಿಯಾಗಿ ಮುಂದುವರಿಯಿರಿ' },
  role_continue_doctor: { en: 'Continue as Doctor', hi: 'डॉक्टर के रूप में जारी रखें', kn: 'ವೈದ್ಯರಾಗಿ ಮುಂದುವರಿಯಿರಿ' },

  // Login
  login_welcome: { en: 'Welcome back!', hi: 'वापस स्वागत है!', kn: 'ಮರಳಿ ಸ್ವಾಗತ!' },
  login_welcome_default: { en: 'Welcome to BioVita', hi: 'BioVita में आपका स्वागत है', kn: 'BioVita ಗೆ ಸುಸ್ವಾಗತ' },
  login_welcome_patient: { en: 'Welcome back, Patient!', hi: 'वापस स्वागत है, मरीज!', kn: 'ಮರಳಿ ಸ್ವಾಗತ, ರೋಗಿ!' },
  login_welcome_doctor: { en: 'Welcome back, Doctor!', hi: 'वापस स्वागत है, डॉक्टर!', kn: 'ಮರಳಿ ಸ್ವಾಗತ, ವೈದ್ಯರು!' },
  login_subtitle: { en: 'Please enter your details', hi: 'कृपया अपना विवरण दर्ज करें', kn: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ' },
  login_email: { en: 'Email', hi: 'ईमेल', kn: 'ಇಮೇಲ್' },
  login_password: { en: 'Password', hi: 'पासवर्ड', kn: 'ಪಾಸ್ವರ್ಡ್' },
  login_remember: { en: 'Remember me', hi: 'मुझे याद रखें', kn: 'ನನ್ನನ್ನು ನೆನಪಿಡಿ' },
  login_forgot: { en: 'Forgot password?', hi: 'पासवर्ड भूल गए?', kn: 'ಪಾಸ್ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?' },
  login_button: { en: 'Log in', hi: 'लॉग इन करें', kn: 'ಲಾಗಿನ್ ಮಾಡಿ' },
  login_btn: { en: 'Sign In', hi: 'साइन इन करें', kn: 'ಸೈನ್ ಇನ್ ಮಾಡಿ' },
  login_google: { en: 'Google', hi: 'ಗೂಗಲ್', kn: 'ಗೂಗಲ್' },
  login_signing_in: { en: 'Signing in...', hi: 'साइन इन हो रहा है...', kn: 'ಸೈನ್ ಇನ್ ಆಗುತ್ತಿದೆ...' },
  login_success_title: { en: 'Login Successful', hi: 'लॉगिन सफल', kn: 'ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ' },
  login_success_msg: { en: 'Welcome back', hi: 'वापस स्वागत है', kn: 'ಮರಳಿ ಸ್ವಾಗತ' },
  login_no_account: { en: "Don't have an account?", hi: 'खाता नहीं है?', kn: 'ಖಾತೆ ಇಲ್ಲವೇ?' },
  login_signup: { en: 'Sign up', hi: 'साइन अप करें', kn: 'ಸೈನ್ अप ಮಾಡಿ' },
  signup_title: { en: 'Create Account', hi: 'खाता बनाएं', kn: 'ಖಾತೆಯನ್ನು ರಚಿಸಿ' },
  signup_subtitle: { en: 'Join BioVita today', hi: 'आज ही BioVita से जुड़ें', kn: 'ಇಂದೇ BioVita ಗೆ ಸೇರಿ' },
  signup_success_title: { en: 'Account Created', hi: 'खाता बनाया गया', kn: 'ಖಾತೆಯನ್ನು ರಚಿಸಲಾಗಿದೆ' },
  signup_success_msg: { en: 'Welcome to BioVita!', hi: 'BioVita में आपका स्वागत है!', kn: 'BioVita ಗೆ ಸುಸ್ವಾಗತ!' },

  // Dashboard Common
  dash_dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड', kn: 'ಡ್ಯಾಶ್ಬೋರ್ಡ್' },
  dash_active_alerts: { en: 'Active Alerts', hi: 'सक्रिय अलर्ट', kn: 'ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆಗಳು' },
  dash_patients: { en: 'Patients', hi: 'मरीज', kn: 'ರೋಗಿಗಳು' },
  dash_records: { en: 'Records', hi: 'रिकॉर्ड', kn: 'ದಾಖಲೆಗಳು' },
  dash_ai: { en: 'AI Assistant', hi: 'AI सहायक', kn: 'AI ಸಹಾಯಕ' },
  dash_vitals: { en: 'Vitals', hi: 'वाइटल्स', kn: 'ವೈಟಲ್ಸ್' },
  dash_chat: { en: 'Chat', hi: 'चैट', kn: 'ಚಾಟ್' },
  dash_settings: { en: 'Settings', hi: 'सेटिंग्स', kn: 'ಸೆಟ್ಟಿಂಗ್ಗಳು' },
  dash_logout: { en: 'Sign Out', hi: 'साइन आउट', kn: 'ಸೈನ್ ಔಟ್' },
  dash_back_home: { en: 'Back to Home', hi: 'होम पर वापस जाएं', kn: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ' },
  dash_menu: { en: 'Menu', hi: 'मेन्यू', kn: 'ಮೆನು' },
  dash_more: { en: 'More', hi: 'अधिक', kn: 'ಇನ್ನಷ್ಟು' },
  dash_alerts: { en: 'Active Alerts', hi: 'सक्रिय अलर्ट', kn: 'ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆಗಳು' },
  dash_pending: { en: 'Pending', hi: 'लंबित', kn: 'ಬಾಕಿ ಇದೆ' },
  dash_files: { en: 'Files', hi: 'फाइलें', kn: 'ಫೈಲ್ಗಳು' },
  dash_last_sync: { en: 'Last Sync', hi: 'पिछला सिंक', kn: 'ಕೊನೆಯ ಸಿಂಕ್' },
  dash_ago: { en: 'ago', hi: 'पहले', kn: 'ಹಿಂದೆ' },
  dash_health_score: { en: 'Health Score', hi: 'स्वास्थ्य स्कोर', kn: 'ಆರೋಗ್ಯ ಸ್ಕೋರ್' },
  dash_health_alerts: { en: 'Health Alerts', hi: 'स्वास्थ्य अलर्ट', kn: 'ಆರೋಗ್ಯ ಎಚ್ಚರಿಕೆಗಳು' },
  dash_active_allergies: { en: 'Active Allergies', hi: 'सक्रिय एलर्जी', kn: 'ಸಕ್ರಿಯ ಅಲರ್ಜಿಗಳು' },
  dash_allergies: { en: 'Allergies', hi: 'एलर्जी', kn: 'ಅಲರ್ಜಿಗಳು' },
  dash_manage_all: { en: 'Manage All', hi: 'सभी प्रबंधित करें', kn: 'ಎಲ್ಲವನ್ನೂ ನಿರ್ವಹಿಸಿ' },
  dash_monitoring: { en: 'Monitoring', hi: 'निगरानी', kn: 'ಮೇಲ್ವಿಚಾರಣೆ' },
  dash_loading: { en: 'Loading', hi: 'लोड हो रहा है', kn: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ' },
  dash_vitals_stable: { en: 'Vitals Stable', hi: 'वाइटल्स स्थिर', kn: 'ವೈಟಲ್ಸ್ ಸ್ಥಿರವಾಗಿದೆ' },
  dash_vitals_desc: { en: 'Your heart rate is normal (72 BPM).', hi: 'आपकी हृदय गति सामान्य है (72 BPM)।', kn: 'ನಿಮ್ಮ ಹೃದಯ ಬಡಿತ ಸಾಮಾನ್ಯವಾಗಿದೆ (72 BPM).' },
  dash_check_vitals: { en: 'Check Vitals', hi: 'वाइटल्स जांचें', kn: 'ವೈಟಲ್ಸ್ ಪರಿಶೀಲಿಸಿ' },
  dash_recent_activity: { en: 'Recent Activity', hi: 'हाल की गतिविधि', kn: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ' },
  dash_for: { en: 'For', hi: 'के लिए', kn: 'ಗಾಗಿ' },

  // Dashboard Activity
  dash_added_allergy: { en: 'Added Allergy', hi: 'एलर्जी जोड़ी गई', kn: 'ಅಲರ್ಜಿ ಸೇರಿಸಲಾಗಿದೆ' },
  dash_uploaded_report: { en: 'Uploaded Report', hi: 'रिपोर्ट अपलोड की गई', kn: 'ವರದಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ' },
  dash_updated_vitals: { en: 'Updated Vitals', hi: 'वाइटल्स अपडेट किए गए', kn: 'ವೈಟಲ್ಸ್ ನವೀಕರಿಸಲಾಗಿದೆ' },
  dash_you: { en: 'You', hi: 'आप', kn: 'ನೀವು' },
  dash_hours_ago: { en: 'hours ago', hi: 'घंटे पहले', kn: 'ಗಂಟೆಗಳ ಹಿಂದೆ' },
  dash_day_ago: { en: 'day ago', hi: 'दिन पहले', kn: 'ದಿನದ ಹಿಂದೆ' },

  // Navigation
  nav_dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड', kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' },
  nav_patients: { en: 'Patients', hi: 'मरीज', kn: 'ರೋಗಿಗಳು' },
  nav_records: { en: 'Records', hi: 'रिकॉर्ड', kn: 'ದಾಖಲೆಗಳು' },
  nav_qr_share: { en: 'QR Share', hi: 'QR शेयर', kn: 'QR ಹಂಚಿಕೆ' },
  nav_ai_assistant: { en: 'AI Assistant', hi: 'AI सहायक', kn: 'AI ಸಹಾಯಕ' },
  nav_nearby: { en: 'Nearby', hi: 'आस-पास', kn: 'ಹತ್ತಿರದ' },
  nav_emergency: { en: 'Emergency', hi: 'आपातकालीन', kn: 'ತುರ್ತು' },
  nav_chat: { en: 'Chat', hi: 'चैट', kn: 'ಚಾಟ್' },
  nav_settings: { en: 'Settings', hi: 'सेटिंग्स', kn: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು' },
  nav_timeline: { en: 'Timeline', hi: 'टाइमलाइन', kn: 'ಟೈಮ್‌ಲೈನ್' },
  nav_vitals: { en: 'Vitals', hi: 'वाइटल्स', kn: 'ವೈಟಲ್ಸ್' },

  // Records View
  rec_all_records: { en: 'All Records', hi: 'सभी रिकॉर्ड', kn: 'ಎಲ್ಲಾ ದಾಖಲೆಗಳು' },
  rec_reports: { en: 'Reports', hi: 'रिपोर्ट', kn: 'ವರದಿಗಳು' },
  rec_prescriptions: { en: 'Prescriptions', hi: 'नुस्खे', kn: 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ಗಳು' },
  rec_scans: { en: 'Scans', hi: 'स्कैन', kn: 'ಸ್ಕ್ಯಾನ್ಗಳು' },
  rec_lab_results: { en: 'Lab Results', hi: 'लैब परिणाम', kn: 'ಲ್ಯಾಬ್ ಫಲಿತಾಂಶಗಳು' },
  rec_lab_reports: { en: 'Lab Reports', hi: 'लैब रिपोर्ट', kn: 'ಲ್ಯಾಬ್ ವರದಿಗಳು' },
  rec_vaccinations: { en: 'Vaccinations', hi: 'टीकाकरण', kn: 'ಲಸಿಕೆಗಳು' },
  rec_view_timeline: { en: 'View Timeline', hi: 'समयरेखा देखें', kn: 'ಟೈಮ್ಲೈನ್ ವೀಕ್ಷಿಸಿ' },
  rec_medical_records: { en: 'Medical Records', hi: 'चिकित्सा रिकॉर्ड', kn: 'ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳು' },
  rec_medical_records_desc: { en: 'Securely store and categorize your health documents', hi: 'अपने स्वास्थ्य दस्तावेजों को सुरक्षित रूप से संग्रहीत और वर्गीकृत करें', kn: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ದಾಖಲೆಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹಿಸಿ ಮತ್ತು ವರ್ಗೀಕರಿಸಿ' },
  rec_file_uploaded: { en: 'File Uploaded', hi: 'फाइल अपलोड की गई', kn: 'ಫೈಲ್ ಅಪ್ಲೋಡ್ ಮಾಡಲಾಗಿದೆ' },
  rec_upload_success: { en: 'has been uploaded successfully.', hi: 'सफलतापूर्वक अपलोड कर दिया गया है।', kn: 'ಯಶಸ್ವಿಯಾಗಿ ಅಪ್ಲೋಡ್ ಮಾಡಲಾಗಿದೆ.' },
  rec_processing: { en: 'Processing Report', hi: 'रिपोर्ट संसाधित की जा रही है', kn: 'ವರದಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ' },
  rec_extracting: { en: 'Extracting vitals from', hi: 'से वाइटल्स निकाले जा रहे हैं', kn: 'ನಿಂದ ವೈಟಲ್ಸ್ ಹೊರತೆಗೆಯಲಾಗುತ್ತಿದೆ' },
  rec_extracted: { en: 'Vitals Extracted', hi: 'वाइटल्स निकाले गए', kn: 'ವೈಟಲ್ಸ್ ಹೊರತೆಗೆಯಲಾಗಿದೆ' },
  rec_processed_success: { en: 'Report processed successfully. Vitals updated.', hi: 'रिपोर्ट सफलतापूर्वक संसाधित की गई। वाइटल्स अपडेट किए गए।', kn: 'ವರದಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗಿದೆ. ವೈಟಲ್ಸ್ ನವೀಕರಿಸಲಾಗಿದೆ.' },
  rec_no_records: { en: 'No records found matching your criteria.', hi: 'आपके मानदंडों से मेल खाने वाला कोई रिकॉर्ड नहीं मिला।', kn: 'ನಿಮ್ಮ ಮಾನದಂಡಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುವ ಯಾವುದೇ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.' },

  // Allergies View
  all_title: { en: 'Allergies & Intolerances', hi: 'एलर्जी और असहिष्णुता', kn: 'ಅಲರ್ಜಿಗಳು ಮತ್ತು ಅಸಹಿಷ್ಣುತೆ' },
  all_subtitle: { en: 'Critical health information for emergency responders', hi: 'आपातकालीन उत्तरदाताओं के लिए महत्वपूर्ण स्वास्थ्य जानकारी', kn: 'ತುರ್ತು ಪ್ರತಿಕ್ರಿಯೆ ನೀಡುವವರಿಗೆ ನಿರ್ಣಾಯಕ ಆರೋಗ್ಯ ಮಾಹಿತಿ' },
  all_add: { en: 'Add Allergy', hi: 'एलर्जी जोड़ें', kn: 'ಅಲರ್ಜಿಯನ್ನು ಸೇರಿಸಿ' },
  all_severity: { en: 'Severity', hi: 'गंभीरता', kn: 'ತೀವ್ರತೆ' },
  all_reaction: { en: 'Reaction', hi: 'प्रतिक्रिया', kn: 'ಪ್ರತಿಕ್ರಿಯೆ' },

  // Patient Dashboard
  pat_active_alerts: { en: 'Active Alerts', hi: 'सक्रिय अलर्ट', kn: 'ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆಗಳು' },
  pat_records_stored: { en: 'Records Stored', hi: 'संग्रहीत रिकॉर्ड', kn: 'ದಾಖಲೆಗಳನ್ನು ಸಂಗ್ರಹಿಸಲಾಗಿದೆ' },
  pat_health_score: { en: 'Health Score', hi: 'स्वास्थ्य स्कोर', kn: 'ಆರೋಗ್ಯ ಸ್ಕೋರ್' },
  pat_upload_record: { en: 'Upload Record', hi: 'रिकॉर्ड अपलोड करें', kn: 'ದಾಖಲೆಯನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿ' },

  // Doctor Dashboard
  doc_title: { en: 'Doctor Dashboard', hi: 'डॉक्टर डैशबोर्ड', kn: 'ಡ್ಯಾಕ್ಟರ್ ಡ್ಯಾಶ್ಬೋರ್ಡ್' },
  doc_subtitle: { en: 'Access and review patient health records', hi: 'मरीज के स्वास्थ्य रिकॉर्ड तक पहुंचें और समीक्षा करें', kn: 'ರೋಗಿಯ ಆರೋಗ್ಯ ದಾಖಲೆಗಳನ್ನು ಪ್ರವೇಶಿಸಿ ಮತ್ತು ಪರಿಶೀಲಿಸಿ' },
  doc_active_cases: { en: 'Active Cases', hi: 'सक्रिय मामले', kn: 'ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು' },
  doc_patients_reviewed: { en: 'Patients Reviewed', hi: 'समीक्षा किए गए मरीज', kn: 'ಪರಿಶೀಲಿಸಿದ ರೋಗಿಗಳು' },
  doc_find_patient: { en: 'Find Patient', hi: 'मरीज खोजें', kn: 'ರೋಗಿಯನ್ನು ಹುಡುಕಿ' },
  doc_search_placeholder: { en: 'Search patient name...', hi: 'मरीज का नाम खोजें...', kn: 'ರೋಗಿಯ ಹೆಸರನ್ನು ಹುಡುಕಿ...' },

  // Features
  feat_label: { en: 'Features', hi: 'विशेषताएं', kn: 'ವೈಶಿಷ್ಟ್ಯಗಳು' },
  feat_title: { en: 'Everything you need for better healthcare', hi: 'बेहतर स्वास्थ्य सेवा के लिए आपकी ज़रूरत की हर चीज़', kn: 'ಉತ್ತಮ ಆರೋಗ್ಯ ರಕ್ಷಣೆಗಾಗಿ ನಿಮಗೆ ಬೇಕಾದ ಎಲ್ಲವೂ' },

  // Pricing
  price_label: { en: 'Pricing', hi: 'मूल्य निर्धारण', kn: 'ಬೆಲೆ' },
  price_title: { en: 'Simple, Transparent Pricing', hi: 'सरल, पारदर्शी मूल्य निर्धारण', kn: 'ಸರಳ, ಪಾರದರ್ಶಕ ಬೆಲೆ' },
  price_monthly: { en: 'Monthly', hi: 'मासिक', kn: 'ಮಾಸಿಕ' },
  price_annual: { en: 'Annual', hi: 'वार्षिक', kn: 'ವಾರ್ಷಿಕ' },
  price_popular: { en: 'Popular', hi: 'लोकप्रिय', kn: 'ಜನಪ್ರಿಯ' },
  price_free_plan: { en: 'Free Plan', hi: 'फ्री प्लान', kn: 'ಉಚಿತ ಯೋಜನೆ' },
  price_pro_plan: { en: 'Pro Plan', hi: 'प्रो प्लान', kn: 'ಪ್ರೊ ಯೋಜನೆ' },
  price_premium_plan: { en: 'Premium Plan', hi: 'प्रीमियम प्लान', kn: 'ಪ್ರೀಮಿಯಂ ಯೋಜನೆ' },

  // Navbar Additional
  nav_nearby_hospitals: { en: 'Nearby Hospitals', hi: 'आस-पास के अस्पताल', kn: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳು' },
  nav_contact: { en: 'Contact', hi: 'संपर्क', kn: 'ಸಂಪರ್ಕ' },
  nav_dashboard_link: { en: 'Dashboard', hi: 'डैशबोर्ड', kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' },
  nav_logout: { en: 'Logout', hi: 'लॉगआउट', kn: 'ಲಗ್ಔಟ್' },

  // Product Section
  prod_how_it_works: { en: 'How BioVita works', hi: 'BioVita कैसे काम करता है', kn: 'BioVita ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ' },
  prod_ai_assistant: { en: 'AI Health Assistant', hi: 'AI स्वास्थ्य सहायक', kn: 'AI ಆರೋಗ್ಯ ಸಹಾಯಕ' },
  prod_ai_desc: { en: 'Engage with our intelligent AI for instant symptom checking and health guidance based on your medical history.', hi: 'अपने चिकित्सा इतिहास के आधार पर त्वरित लक्षण जांच और स्वास्थ्य मार्गदर्शन के लिए हमारे बुद्धिमान AI के साथ जुड़ें।', kn: 'ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಇತಿಹಾಸದ ಆಧಾರದ ಮೇಲೆ ತ್ವರಿತ ರೋಗಲಕ್ಷಣ ತಪಾಸಣೆ ಮತ್ತು ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ನಮ್ಮ ಬುದ್ಧಿವಂತ AI ನೊಂದಿಗೆ ತೊಡಗಿಸಿಕೊಳ್ಳಿ.' },
  prod_try_ai: { en: 'Try AI Assistant', hi: 'AI सहायक आज़माएं', kn: 'AI ಸಹಾಯಕವನ್ನು ಪ್ರಯತ್ನಿಸಿ' },
  prod_ask_ai: { en: 'Ask BioVita AI...', hi: 'BioVita AI से पूछें...', kn: 'BioVita AI ಅನ್ನು ಕೇಳಿ...' },
  prod_vault_title: { en: 'Health Record Vault', hi: 'स्वास्थ्य रिकॉर्ड वॉल्ट', kn: 'ಆರೋಗ್ಯ ದಾಖಲೆ ವಾಲ್ಟ್' },
  prod_vault_desc: { en: 'Store and manage your medical records in one secure, encrypted dashboard accessible from anywhere.', hi: 'अपने चिकित्सा रिकॉर्ड को एक सुरक्षित, एन्क्रिप्टेड डैशबोर्ड में संग्रहीत और प्रबंधित करें जो कहीं से भी सुलभ हो।', kn: 'ಎಲ್ಲಿಂದಲಾದರೂ ಪ್ರವೇಶಿಸಬಹುದಾದ ಒಂದು ಸುರಕ್ಷಿತ, ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಲಾದ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ.' },
  prod_access_title: { en: 'Instant Health Data Access', hi: 'त्वरित स्वास्थ्य डेटा पहुंच', kn: 'ತ್ವರಿತ ಆರೋಗ್ಯ ಡೇಟಾ ಪ್ರವೇಶ' },
  prod_access_desc: { en: 'Retrieve critical health information instantly. Track vitals, medication schedules, and historical data with intuitive visualizations.', hi: 'महत्वपूर्ण स्वास्थ्य जानकारी तुरंत प्राप्त करें। सहज दृश्यता के साथ वाइटल्स, दवा के शेड्यूल और ऐतिहासिक डेटा को ट्रैक करें।', kn: 'ನಿರ್ಣಾಯಕ ಆರೋಗ್ಯ ಮಾಹಿತಿಯನ್ನು ತಕ್ಷಣವೇ ಹಿಂಪಡೆಯಿರಿ. ಅಂತರ್ಬೋಧೆಯ ದೃಶ್ಯೀಕರಣಗಳೊಂದಿಗೆ ವೈಟಲ್ಸ್, ಔಷಧಿ ವೇಳಾಪಟ್ಟಿಗಳು ಮತ್ತು ಐತಿಹಾಸಿಕ ಡೇಟಾವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.' },
  prod_sos_title: { en: 'Emergency SOS & QR Sharing', hi: 'आपातकालीन SOS और QR शेयरिंग', kn: 'ತುರ್ತು SOS ಮತ್ತು QR ಹಂಚಿಕೆ' },
  prod_sos_desc: { en: 'Trigger emergency alerts with one click or share medical profiles via secure QR codes for instant access by medical professionals.', hi: 'चिकित्सा पेशेवरों द्वारा त्वरित पहुंच के लिए एक क्लिक के साथ आपातकालीन अलर्ट ट्रिगर करें या सुरक्षित QR कोड के माध्यम से चिकित्सा प्रोफाइल साझा करें।', kn: 'ವೈದ್ಯಕೀಯ ವೃತ್ತಿಪರರಿಂದ ತಕ್ಷಣದ ಪ್ರವೇಶಕ್ಕಾಗಿ ಒಂದು ಕ್ಲಿಕ್‌ನಲ್ಲಿ ತುರ್ತು ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪ್ರಚೋದಿಸಿ ಅಥವಾ ಸುರಕ್ಷಿತ QR ಕೋಡ್‌ಗಳ ಮೂಲಕ ವೈದ್ಯಕೀಯ ಪ್ರೊಫೈಲ್‌ಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.' },
  prod_trigger_sos: { en: 'Trigger SOS Alert', hi: 'SOS अलर्ट ट्रिगर करें', kn: 'SOS ಎಚ್ಚರಿಕೆಯನ್ನು ಪ್ರಚೋದಿಸಿ' },
  prod_gen_qr: { en: 'Generate QR Profile', hi: 'QR प्रोफाइल बनाएं', kn: 'QR ಪ್ರೊಫೈಲ್ ರಚಿಸಿ' },
  prod_share_hosp: { en: 'Share with Hospital', hi: 'अस्पताल के साथ साझा करें', kn: 'ಆಸ್ಪತ್ರೆಯೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ' },

  // Footer
  foot_stay_healthy: { en: 'Stay Healthy', hi: 'स्वस्थ रहें', kn: 'ಆರೋಗ್ಯವಾಗಿರಿ' },
  foot_desc: { en: 'Your trusted partner in digital health management. Empowering you with data and insights.', hi: 'डिजिटल स्वास्थ्य प्रबंधन में आपका भरोसेमंद साथी। डेटा और अंतर्दृष्टि के साथ आपको सशक्त बनाना।', kn: 'ಡಿಜಿಟಲ್ ಆರೋಗ್ಯ ನಿರ್ವಹಣೆಯಲ್ಲಿ ನಿಮ್ಮ ವಿಶ್ವಾಸಾರ್ಹ ಪಾಲುದಾರ. ಡೇಟಾ ಮತ್ತು ಒಳನೋಟಗಳೊಂದಿಗೆ ನಿಮ್ಮನ್ನು ಸಬಲಗೊಳಿಸುವುದು.' },
  foot_platform: { en: 'Platform', hi: 'प्लेटफॉर्म', kn: 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್' },
  foot_core_feat: { en: 'Core Features', hi: 'मुख्य विशेषताएं', kn: 'ಮೂಲ ವೈಶಿಷ್ಟ್ಯಗಳು' },
  foot_contact_us: { en: 'Contact Us', hi: 'संपर्क करें', kn: 'ನಮ್ಮನ್ನು संपर्कಿಸಿ' },
  foot_rights: { en: 'All rights reserved.', hi: 'सर्वाधिकार सुरक्षित।', kn: 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.' },

  // CTA
  cta_title: { en: 'Be prepared. Stay informed. Protect your health.', hi: 'तैयार रहें। सूचित रहें। अपने स्वास्थ्य की रक्षा करें।', kn: 'ಸಿದ್ಧರಾಗಿರಿ. ಮಾಹಿತಿ ಪಡೆಯಿರಿ. ನಿಮ್ಮ ಆರೋಗ್ಯವನ್ನು ರಕ್ಷಿಸಿ.' },
  cta_desc: { en: 'Join thousands of users who trust BioVita for secure, instant access to their health data.', hi: 'BioVita पर भरोसा करने वाले हजारों उपयोगकर्ताओं में शामिल हों, जो अपने स्वास्थ्य डेटा तक सुरक्षित, त्वरित पहुंच प्रदान करते हैं।', kn: 'ತಮ್ಮ ಆರೋಗ್ಯ ಡೇಟಾಗೆ ಸುರಕ್ಷಿತ, ತ್ವರಿತ ಪ್ರವೇಶಕ್ಕಾಗಿ BioVita ಅನ್ನು ನಂಬುವ ಸಾವಿರಾರು ಬಳಕೆದಾರರನ್ನು ಸೇರಿ.' },
  cta_button: { en: 'Start Using BioVita', hi: 'BioVita का उपयोग शुरू करें', kn: 'BioVita ಬಳಸಲು ಪ್ರಾರಂಭಿಸಿ' },

  // FAQ
  faq_title: { en: 'Frequently Asked Questions', hi: 'सामान्य प्रश्न', kn: 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು' },
  faq_subtitle: { en: "Have a question? We've got answers. If you don't find what you're looking for, feel free to contact us.", hi: 'कोई प्रश्न है? हमारे पास जवाब हैं। यदि आप वह नहीं पाते जो आप खोज रहे हैं, तो बेझिझक हमसे संपर्क करें।', kn: 'ಪ್ರಶ್ನೆ ಇದೆಯೇ? ನಮ್ಮಲ್ಲಿ ಉತ್ತರಗಳಿವೆ. ನೀವು ಹುಡುಕುತ್ತಿರುವುದು ಸಿಗದಿದ್ದರೆ, ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಲು ಮುಕ್ತವಾಗಿರಿ.' },
  faq_still_questions: { en: 'Still have questions?', hi: 'अभी भी प्रश्न हैं?', kn: 'ಇನ್ನೂ ಪ್ರಶ್ನೆಗಳಿವೆಯೇ?' },
  faq_contact_desc: { en: "Our team is here to help. Get in touch and we'll respond as soon as possible.", hi: 'हमारी टीम मदद के लिए यहाँ है। संपर्क करें और हम जल्द से जल्द जवाब देंगे।', kn: 'ನಮ್ಮ ತಂಡ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದೆ. ಸಂಪರ್ಕಿಸಿ ಮತ್ತು ನಾವು ಆದಷ್ಟು ಬೇಗ ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತೇವೆ.' },
  faq_contact_button: { en: 'Contact Support', hi: 'सपोर्ट से संपर्क करें', kn: 'ಸಂಪರ್ಕ ಬೆಂಬಲ' },
  // About
  about_desc: { en: 'BioVita is a comprehensive digital health platform designed to centralize medical records, provide AI-driven health insights, and ensure emergency preparedness through secure, instant data access. Our mission is to empower users globally by making vital health information accessible and manageable, ensuring peace of mind through innovative technology and a commitment to data privacy.', hi: 'BioVita एक व्यापक डिजिटल स्वास्थ्य मंच है जिसे चिकित्सा रिकॉर्ड को केंद्रीकृत करने, AI-आधारित स्वास्थ्य अंतर्दृष्टि प्रदान करने और सुरक्षित, त्वरित डेटा पहुंच के माध्यम से आपातकालीन तैयारी सुनिश्चित करने के लिए डिज़ाइन किया गया है। हमारा मिशन महत्वपूर्ण स्वास्थ्य जानकारी को सुलभ और प्रबंधनीय बनाकर विश्व स्तर पर उपयोगकर्ताओं को सशक्त बनाना है, जो अभिनव तकनीक और डेटा गोपनीयता के प्रति प्रतिबद्धता के माध्यम से मन की शांति सुनिश्चित करता है।', kn: 'BioVita ಎಂಬುದು ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳನ್ನು ಕೇಂದ್ರೀಕರಿಸಲು, AI- ಚಾಲಿತ ಆರೋಗ್ಯ ಒಳನೋಟಗಳನ್ನು ಒದಗಿಸಲು ಮತ್ತು ಸುರಕ್ಷಿತ, ತ್ವರಿತ ಡೇಟಾ ಪ್ರವೇಶದ ಮೂಲಕ ತುರ್ತು ಸಿದ್ಧತೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಸಮಗ್ರ ಡಿಜಿಟಲ್ ಆರೋಗ್ಯ ವೇದಿಕೆಯಾಗಿದೆ. ನವೀನ ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಡೇಟಾ ಗೌಪ್ಯತೆಗೆ ಬದ್ಧತೆಯ ಮೂಲಕ ಮನಸ್ಸಿನ ಶಾಂತಿಯನ್ನು ಖಾತ್ರಿಪಡಿಸಿಕೊಳ್ಳುವ ಮೂಲಕ ಪ್ರಮುಖ ಆರೋಗ್ಯ ಮಾಹಿತಿಯನ್ನು ಪ್ರವೇಶಿಸಬಹುದಾದ ಮತ್ತು ನಿರ್ವಹಿಸಬಹುದಾದಂತೆ ಮಾಡುವ ಮೂಲಕ ಜಾಗತಿಕವಾಗಿ ಬಳಕೆದಾರರನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸುವುದು ನಮ್ಮ ಉದ್ದೇಶವಾಗಿದೆ.' },

  // Testimonials
  test_label: { en: 'Testimonials', hi: 'प्रशंसापत्र', kn: 'ಪ್ರಶಂಸಾಪತ್ರಗಳು' },
  test_title: { en: 'What our users say', hi: 'हमारे उपयोगकर्ता क्या कहते हैं', kn: 'ನಮ್ಮ ಬಳಕೆದಾರರು ಏನು ಹೇಳುತ್ತಾರೆ' },
  test_subtitle: { en: 'Discover how thousands of users take control of their health journey with BioVita.', hi: 'डिस्कवर करें कि कैसे हजारों उपयोगकर्ता BioVita के साथ अपनी स्वास्थ्य यात्रा को नियंत्रित करते हैं।', kn: 'BioVita ನೊಂದಿಗೆ ಸಾವಿರಾರು ಬಳಕೆದಾರರು ತಮ್ಮ ಆರೋಗ್ಯ ಪ್ರಯಾಣದ ಮೇಲೆ ಹೇಗೆ ನಿಯಂತ್ರಣ ಸಾಧಿಸುತ್ತಾರೆ ಎಂಬುದನ್ನು ಕಂಡುಕೊಳ್ಳಿ.' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('biovita_lang');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('biovita_lang', lang);
  };

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
