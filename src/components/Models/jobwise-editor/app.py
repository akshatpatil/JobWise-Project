import streamlit as st
import PyPDF2
import io
import re
from collections import Counter
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import base64
from datetime import datetime
import tempfile
import os
import subprocess
import requests
import json

# ReportLab imports for PDF generation
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, ListFlowable, ListItem
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import pytesseract
from PIL import Image

# Try to import OCR tools for better text extraction
try:
    import pytesseract
    from pdf2image import convert_from_bytes
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False
    st.warning("OCR capabilities not available. Install pdf2image and pytesseract for better text extraction.")

# Install required packages if not already installed
try:
    nlp = spacy.load("en_core_web_sm")
except IOError:
    st.error("Please install spaCy English model: python -m spacy download en_core_web_sm")
    st.stop()

# Gemini API configuration
GEMINI_API_KEY = "AIzaSyBCBv4-VA7wTetoH9ortq2amfMFuCkLS34"
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

class GeminiAnalyzer:
    def __init__(self, api_key):
        self.api_key = api_key
        self.api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    
    def analyze_resume_with_gemini(self, resume_text, job_description):
        """Use Gemini API for advanced resume analysis"""
        prompt = f"""
        Analyze the following resume against the job description and provide detailed recommendations:

        RESUME:
        {resume_text}

        JOB DESCRIPTION:
        {job_description}

        Please provide analysis in the following JSON format:
        {{
            "match_score": 0.75,
            "strengths": ["list of strengths"],
            "weaknesses": ["list of weaknesses"],
            "missing_keywords": ["list of missing keywords"],
            "recommendations": [
                {{
                    "type": "critical|warning|info",
                    "title": "recommendation title",
                    "description": "detailed description",
                    "action": "specific action to take"
                }}
            ],
            "suggested_improvements": {{
                "summary": "improved professional summary",
                "experience_enhancements": ["specific experience improvements"],
                "skills_to_add": ["technical skills to add"]
            }}
        }}
        """
        
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        }
        
        try:
            response = requests.post(self.api_url, json=payload)
            if response.status_code == 200:
                result = response.json()
                content = result['candidates'][0]['content']['parts'][0]['text']
                
                # Extract JSON from response
                json_start = content.find('{')
                json_end = content.rfind('}') + 1
                if json_start != -1 and json_end != 0:
                    json_content = content[json_start:json_end]
                    return json.loads(json_content)
            return None
        except Exception as e:
            st.error(f"Gemini API error: {str(e)}")
            return None


class OCRProcessor:
    """Enhanced OCR processing for better text extraction from PDFs"""
    
    def __init__(self):
        self.ocr_available = OCR_AVAILABLE
    
    def extract_text_with_ocr(self, pdf_file):
        """Extract text from PDF using OCR for better results"""
        if not self.ocr_available:
            return None
        
        try:
            # Convert PDF to images
            pdf_bytes = pdf_file.read()
            pdf_file.seek(0)  # Reset file pointer for later use
            
            images = convert_from_bytes(pdf_bytes)
            text = ""
            
            # Process each page with OCR
            for image in images:
                page_text = pytesseract.image_to_string(image)
                text += page_text + "\n\n"
            
            return text
        except Exception as e:
            return None


class ResumeAnalyzer:
    def __init__(self):
        self.keywords_database = {
            'technical_skills': [
                'python', 'java', 'javascript', 'react', 'node.js', 'sql', 'mongodb',
                'aws', 'azure', 'docker', 'kubernetes', 'git', 'linux', 'machine learning',
                'data analysis', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn',
                'html', 'css', 'angular', 'vue.js', 'c++', 'c#', '.net', 'spring boot',
                'microservices', 'rest api', 'graphql', 'redis', 'elasticsearch'
            ],
            'soft_skills': [
                'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
                'project management', 'agile', 'scrum', 'collaboration', 'innovation',
                'creativity', 'adaptability', 'time management', 'mentoring', 'training'
            ],
            'action_verbs': [
                'developed', 'implemented', 'designed', 'created', 'managed', 'led',
                'improved', 'optimized', 'analyzed', 'built', 'delivered', 'achieved',
                'increased', 'reduced', 'streamlined', 'collaborated', 'mentored'
            ]
        }
        self.gemini_analyzer = GeminiAnalyzer(GEMINI_API_KEY)
        self.ocr_processor = OCRProcessor()
    
    def extract_text_from_pdf(self, pdf_file):
        """Extract text from uploaded PDF file with OCR fallback"""
        # Try OCR first for better extraction
        if OCR_AVAILABLE:
            ocr_text = self.ocr_processor.extract_text_with_ocr(pdf_file)
            if ocr_text and len(ocr_text.strip()) > 100:  # Verify we got meaningful text
                return ocr_text
        
        # Fallback to PyPDF2
        try:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            return text
        except Exception as e:
            st.error(f"Error reading PDF: {str(e)}")
            return ""
    
    def preprocess_text(self, text):
        """Clean and preprocess text"""
        text = text.lower()
        text = re.sub(r'[^\w\s]', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        return text.strip()
    
    def extract_keywords(self, text):
        """Extract keywords using spaCy NLP"""
        doc = nlp(text)
        keywords = []
        
        for ent in doc.ents:
            if ent.label_ in ['ORG', 'PRODUCT', 'SKILL']:
                keywords.append(ent.text.lower())
        
        for chunk in doc.noun_chunks:
            keywords.append(chunk.text.lower())
        
        for token in doc:
            if token.pos_ in ['NOUN', 'PROPN'] and len(token.text) > 2:
                keywords.append(token.text.lower())
        
        return list(set(keywords))
    
    def calculate_match_score(self, resume_text, job_description):
        """Calculate similarity score between resume and job description"""
        vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
        similarity_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return similarity_score
    
    def analyze_resume_comprehensive(self, resume_text, job_description):
        """Comprehensive resume analysis using both traditional methods and Gemini AI"""
        # Traditional analysis
        resume_clean = self.preprocess_text(resume_text)
        job_clean = self.preprocess_text(job_description)
        
        job_keywords = self.extract_keywords(job_clean)
        resume_keywords = self.extract_keywords(resume_clean)
        missing_keywords = [kw for kw in job_keywords if kw not in resume_clean]
        match_score = self.calculate_match_score(resume_clean, job_clean)
        
        # Gemini AI analysis
        gemini_analysis = self.gemini_analyzer.analyze_resume_with_gemini(resume_text, job_description)
        
        # Combine results
        if gemini_analysis:
            return {
                'match_score': gemini_analysis.get('match_score', match_score),
                'missing_keywords': gemini_analysis.get('missing_keywords', missing_keywords[:10]),
                'recommendations': gemini_analysis.get('recommendations', []),
                'suggested_improvements': gemini_analysis.get('suggested_improvements', {}),
                'strengths': gemini_analysis.get('strengths', []),
                'weaknesses': gemini_analysis.get('weaknesses', []),
                'resume_keywords': resume_keywords,
                'job_keywords': job_keywords
            }
        else:
            # Fallback to traditional analysis
            recommendations = self.generate_recommendations(resume_text, job_description, missing_keywords, match_score)
            return {
                'match_score': match_score,
                'missing_keywords': missing_keywords[:10],
                'recommendations': recommendations,
                'suggested_improvements': {},
                'strengths': [],
                'weaknesses': [],
                'resume_keywords': resume_keywords,
                'job_keywords': job_keywords
            }
    
    def generate_recommendations(self, resume_text, job_description, missing_keywords, match_score):
        """Generate specific recommendations for resume improvement"""
        recommendations = []
        
        if match_score < 0.3:
            recommendations.append({
                'type': 'critical',
                'title': 'Low Match Score',
                'description': f'Your resume has a {match_score:.1%} match with the job description.',
                'action': 'Rewrite your resume to better align with the job requirements'
            })
        elif match_score < 0.6:
            recommendations.append({
                'type': 'warning',
                'title': 'Moderate Match Score',
                'description': f'Your resume has a {match_score:.1%} match.',
                'action': 'Add more relevant keywords and experiences'
            })
        
        if missing_keywords:
            recommendations.append({
                'type': 'info',
                'title': 'Missing Keywords',
                'description': f'Consider adding: {", ".join(missing_keywords[:5])}',
                'action': 'Integrate these keywords naturally into your experience descriptions'
            })
        
        return recommendations


class ReportLabPDFGenerator:
    """PDF Generator using ReportLab for formal resume formatting"""
    
    def __init__(self):
        # Define styles
        self.styles = getSampleStyleSheet()
        self.setup_styles()
        
    def setup_styles(self):
        """Setup custom styles for the resume"""
        # Add custom fonts if desired
        # Try to register Helvetica-based fonts for a professional look
        try:
            pdfmetrics.registerFont(TTFont('Helvetica', 'Helvetica.ttf'))
            pdfmetrics.registerFont(TTFont('Helvetica-Bold', 'Helvetica-Bold.ttf'))
        except:
            pass  # Default to built-in fonts if custom ones aren't available
            
        # Header style
        self.header_style = ParagraphStyle(
            name='Header',
            fontName='Helvetica-Bold',
            fontSize=18,
            alignment=1,  # centered
            spaceAfter=12
        )
        
        # Section header style
        self.section_style = ParagraphStyle(
            name='Section',
            fontName='Helvetica-Bold',
            fontSize=12,
            textColor=colors.navy,
            spaceBefore=12,
            spaceAfter=6
        )
        
        # Normal text style
        self.normal_style = ParagraphStyle(
            name='Normal',
            fontName='Helvetica',
            fontSize=10,
            leading=14
        )
        
        # Contact info style
        self.contact_style = ParagraphStyle(
            name='Contact',
            fontName='Helvetica',
            fontSize=10,
            alignment=1,  # centered
            spaceAfter=10
        )
        
        # Bullet style
        self.bullet_style = ParagraphStyle(
            name='Bullet',
            fontName='Helvetica',
            fontSize=10,
            leftIndent=20,
            firstLineIndent=-15,
            leading=14
        )
        
        # Experience header style
        self.exp_header_style = ParagraphStyle(
            name='ExpHeader',
            fontName='Helvetica-Bold',
            fontSize=11,
            spaceBefore=6,
            spaceAfter=3
        )
        
        # Experience subtitle style
        self.exp_subtitle_style = ParagraphStyle(
            name='ExpSubtitle',
            fontName='Helvetica-Bold',
            fontSize=10,
            textColor=colors.darkgrey,
            spaceAfter=6
        )
    
    def extract_resume_sections(self, resume_text, analysis_results):
        """Extract resume sections from text and analysis"""
        sections = {
            'name': '',
            'email': '',
            'phone': '',
            'location': '',
            'linkedin': '',
            'github': '',
            'summary': '',
            'experience': [],
            'education': [],
            'skills': []
        }
        
        # Extract contact information using regex
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_match = re.search(email_pattern, resume_text)
        if email_match:
            sections['email'] = email_match.group()
        
        phone_pattern = r'(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}'
        phone_match = re.search(phone_pattern, resume_text)
        if phone_match:
            sections['phone'] = phone_match.group()
        
        linkedin_pattern = r'linkedin\.com/in/[\w-]+'
        linkedin_match = re.search(linkedin_pattern, resume_text, re.IGNORECASE)
        if linkedin_match:
            sections['linkedin'] = linkedin_match.group()
        
        github_pattern = r'github\.com/[\w-]+'
        github_match = re.search(github_pattern, resume_text, re.IGNORECASE)
        if github_match:
            sections['github'] = github_match.group()
        
        # Extract name (assume first line or prominent text)
        lines = resume_text.split('\n')
        for line in lines[:5]:  # Check first few lines
            if line.strip() and not re.search(email_pattern, line) and not re.search(phone_pattern, line):
                sections['name'] = line.strip()
                break
        
        # Extract location (common formats: City, State or City, Country)
        location_pattern = r'\b[A-Z][a-z]+,\s*[A-Z]{2}\b|\b[A-Z][a-z]+,\s*[A-Z][a-z]+\b'
        location_match = re.search(location_pattern, resume_text)
        if location_match:
            sections['location'] = location_match.group()
        
        # Enhanced content using AI suggestions
        if 'suggested_improvements' in analysis_results:
            improvements = analysis_results['suggested_improvements']
            
            if 'summary' in improvements:
                sections['summary'] = improvements['summary']
            
            if 'skills_to_add' in improvements:
                skills = improvements['skills_to_add'] + analysis_results.get('missing_keywords', [])
                sections['skills'] = list(set([skill.title() for skill in skills[:15]]))
        
        # Extract skills from resume text if not found via improvements
        if not sections['skills']:
            # Common skills section headers
            skill_headers = ['skills', 'technical skills', 'core competencies', 'key skills']
            lines = resume_text.split('\n')
            
            # Try to locate skills section and extract
            in_skills_section = False
            skills = []
            
            for i, line in enumerate(lines):
                line_lower = line.lower().strip()
                
                # Check if this is a skills section header
                if any(header in line_lower for header in skill_headers):
                    in_skills_section = True
                    continue
                
                # Check if we've reached another section
                if in_skills_section and line_lower and len(line_lower) > 2 and ':' in line_lower[-2:]:
                    in_skills_section = False
                    
                # Extract skills
                if in_skills_section and line.strip():
                    # Split skills by common separators
                    skill_candidates = re.split(r'[,•·|\\/]', line)
                    skills.extend([s.strip() for s in skill_candidates if s.strip()])
            
            # Clean up skills
            if skills:
                sections['skills'] = list(set([skill for skill in skills if 2 <= len(skill) <= 25]))
            else:
                # If no skills section found, use missing keywords from analysis
                sections['skills'] = [kw.title() for kw in analysis_results.get('missing_keywords', [])[:10]]
        
        # Extract summary from resume or generate if not found
        if not sections['summary']:
            summary_pattern = r'(?:professional\s+summary|summary|profile|objective)[:.\s]*([^\n]+(?:\n[^\n]+){0,3})'
            summary_match = re.search(summary_pattern, resume_text, re.IGNORECASE)
            
            if summary_match:
                sections['summary'] = summary_match.group(1).strip()
            else:
                # Generate summary based on analysis
                sections['summary'] = self.generate_enhanced_summary(analysis_results)
        
        # Add some fallback or example experience entries if needed for the template
        if not sections['experience']:
            sections['experience'] = [
                {
                    'title': 'Software Engineer',
                    'company': 'Example Company',
                    'dates': '2020 - Present',
                    'description': [
                        'Developed scalable software solutions improving system performance by 30%',
                        'Led cross-functional team of 5 developers in agile environment',
                        'Collaborated with stakeholders to define requirements and deliver high-quality products'
                    ]
                },
                {
                    'title': 'Junior Developer',
                    'company': 'Previous Company',
                    'dates': '2018 - 2020',
                    'description': [
                        'Designed and implemented key features for enterprise applications',
                        'Optimized database queries and improved application response time by 25%',
                        'Contributed to team knowledge sharing initiatives'
                    ]
                }
            ]
        
        # Add education entry if needed for the template
        if not sections['education']:
            sections['education'] = [
                {
                    'degree': 'Bachelor of Science in Computer Science',
                    'institution': 'University Name',
                    'dates': 'Graduation Year',
                    'details': ['GPA: 3.X/4.0', 'Relevant Coursework: Data Structures, Algorithms']
                }
            ]
            
        return sections
    
    def generate_enhanced_summary(self, analysis_results):
        """Generate an enhanced professional summary"""
        strengths = analysis_results.get('strengths', [])
        if strengths:
            return f"Dynamic professional with proven expertise in {', '.join(strengths[:3])}. Demonstrated track record of delivering high-impact results through innovative solutions and strategic thinking. Committed to continuous learning and excellence in technology and business domains."
        else:
            return "Results-driven professional with strong analytical and technical skills. Proven ability to deliver high-quality solutions and drive business value through innovative approaches and collaborative teamwork."
    
    def create_pdf_resume(self, resume_data, output_filename):
        """Create a professionally formatted PDF resume using ReportLab"""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer, 
            pagesize=letter,
            leftMargin=0.5*inch,
            rightMargin=0.5*inch,
            topMargin=0.5*inch,
            bottomMargin=0.5*inch
        )
        
        # Story is the list of flowables that make up the document
        story = []
        
        # Name header
        name = resume_data.get('name', 'Your Full Name')
        story.append(Paragraph(name, self.header_style))
        
        # Contact information
        contact_parts = []
        if resume_data.get('email'):
            contact_parts.append(f"Email: {resume_data['email']}")
        if resume_data.get('phone'):
            contact_parts.append(f"Phone: {resume_data['phone']}")
        if resume_data.get('location'):
            contact_parts.append(f"Location: {resume_data['location']}")
        
        # Add LinkedIn and GitHub if available
        links = []
        if resume_data.get('linkedin'):
            links.append(f"LinkedIn: {resume_data['linkedin']}")
        if resume_data.get('github'):
            links.append(f"GitHub: {resume_data['github']}")
        
        # Add contact info and links to document
        if contact_parts:
            story.append(Paragraph(" | ".join(contact_parts), self.contact_style))
        if links:
            story.append(Paragraph(" | ".join(links), self.contact_style))
        
        # Professional Summary
        if resume_data.get('summary'):
            story.append(Paragraph('PROFESSIONAL SUMMARY', self.section_style))
            story.append(Paragraph(resume_data['summary'], self.normal_style))
        
        # Experience Section
        if resume_data.get('experience'):
            story.append(Paragraph('PROFESSIONAL EXPERIENCE', self.section_style))
            
            for exp in resume_data['experience']:
                # Job title and company
                title = exp.get('title', '')
                company = exp.get('company', '')
                dates = exp.get('dates', '')
                
                story.append(Paragraph(f"{title}", self.exp_header_style))
                story.append(Paragraph(f"{company} | {dates}", self.exp_subtitle_style))
                
                # Job description
                if exp.get('description'):
                    bullets = []
                    for item in exp['description']:
                        bullets.append(ListItem(Paragraph(item, self.bullet_style)))
                    
                    story.append(ListFlowable(
                        bullets,
                        bulletType='bullet',
                        start='•'
                    ))
                    
                story.append(Spacer(1, 0.1*inch))
        
        # Education Section
        if resume_data.get('education'):
            story.append(Paragraph('EDUCATION', self.section_style))
            
            for edu in resume_data['education']:
                # Degree and institution
                degree = edu.get('degree', '')
                institution = edu.get('institution', '')
                dates = edu.get('dates', '')
                
                story.append(Paragraph(f"{degree}", self.exp_header_style))
                story.append(Paragraph(f"{institution} | {dates}", self.exp_subtitle_style))
                
                # Education details
                if edu.get('details'):
                    bullets = []
                    for item in edu['details']:
                        bullets.append(ListItem(Paragraph(item, self.bullet_style)))
                    
                    story.append(ListFlowable(
                        bullets,
                        bulletType='bullet',
                        start='•'
                    ))
                    
                story.append(Spacer(1, 0.1*inch))
        
        # Skills Section
        if resume_data.get('skills'):
            story.append(Paragraph('TECHNICAL SKILLS', self.section_style))
            
            # Create a clean, well-formatted skills section
            # Format skills in multiple columns for better presentation
            skills = resume_data['skills']
            skills_per_row = 3
            
            for i in range(0, len(skills), skills_per_row):
                skill_row = skills[i:i+skills_per_row]
                while len(skill_row) < skills_per_row:
                    skill_row.append('')  # Pad with empty strings
                
                # Create a table row with skills
                data = [skill_row]
                t = Table(data, colWidths=[doc.width/skills_per_row]*skills_per_row)
                t.setStyle(TableStyle([
                    ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                    ('FONTSIZE', (0, 0), (-1, -1), 10),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ]))
                story.append(t)
                
            story.append(Spacer(1, 0.1*inch))
        
        # Build the PDF
        doc.build(story)
        pdf_data = buffer.getvalue()
        buffer.close()
        
        return pdf_data
    
    def generate_optimized_resume_pdf(self, resume_text, analysis_results):
        """Generate a professionally formatted resume PDF with AI recommendations"""
        # Extract content from resume and analysis
        resume_data = self.extract_resume_sections(resume_text, analysis_results)
        
        # Create PDF
        pdf_content = self.create_pdf_resume(resume_data, "optimized_resume.pdf")
        return pdf_content
    
def main():
    st.set_page_config(
        page_title="AI Resume Optimizer Pro", 
        page_icon="🚀", 
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    # Custom CSS
    st.markdown("""
    <style>
    .main-header {
        text-align: center;
        padding: 2rem 0;
        background: linear-gradient(135deg, #3a1859 0%, #5e3370 100%);
        color: #f3eaff;
        border-radius: 15px;
        margin-bottom: 2rem;
        box-shadow: 0 4px 6px rgba(40,0,60,0.25);
    }
    .recommendation-card {
        padding: 1.5rem;
        border-radius: 12px;
        margin: 1rem 0;
        border-left: 5px solid;
        box-shadow: 0 2px 4px rgba(40,0,60,0.25);
    }
    .critical { border-left-color: #7c1e5a; background-color: #3a1859; color: #f3eaff; }
    .warning { border-left-color: #a97bc7; background-color: #4b256a; color: #f3eaff; }
    .info { border-left-color: #6c4f99; background-color: #2e1a47; color: #f3eaff; }
    .success { border-left-color: #8e7cc3; background-color: #3d246c; color: #f3eaff; }
    .metric-container {
        background: linear-gradient(45deg, #2e1a47, #4b256a);
        color: #f3eaff;
        padding: 1rem;
        border-radius: 10px;
        margin: 1rem 0;
    }
    .download-button {
        background: linear-gradient(45deg, #6c4f99, #3a1859);
        color: #f3eaff;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        text-decoration: none;
        display: inline-block;
        margin: 0.5rem;
        box-shadow: 0 2px 4px rgba(40,0,60,0.25);
        transition: transform 0.2s;
    }
    .download-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(40,0,60,0.35);
    }
    </style>
    """, unsafe_allow_html=True)
    
    # Header
    st.markdown("""
    <div class="main-header">
        <h1>🚀 AI Resume Optimizer Pro</h1>
        <p>Advanced resume analysis with PDF generation, AI-powered recommendations, and professional formatting</p>
        <p><em>Powered by Gemini AI, ReportLab, and Advanced NLP</em></p>
    </div>
    """, unsafe_allow_html=True)
    
    # Initialize session state
    for key in ['analysis_done', 'pdf_content', 'analysis_results']:
        if key not in st.session_state:
            st.session_state[key] = None if key != 'analysis_done' else False
    
    # Initialize classes
    analyzer = ResumeAnalyzer()
    pdf_generator = ReportLabPDFGenerator()
    
    # Sidebar
    with st.sidebar:
        st.header("📁 Upload & Configure")
        
        # File upload section
        st.subheader("Upload Resume")
        resume_file = st.file_uploader(
            "Upload your resume (PDF)", 
            type=['pdf'],
            help="Upload your current resume in PDF format"
        )
        
        # Job description
        st.subheader("Job Description")
        job_description = st.text_area(
            "Paste the job description", 
            height=200,
            help="Copy and paste the complete job description here",
            placeholder="Paste the full job description including requirements, responsibilities, and qualifications..."
        )
        
        # Analysis options
        st.subheader("⚙️ Analysis Options")
        use_gemini = st.checkbox("Use Gemini AI Analysis", value=True, help="Enable advanced AI-powered analysis")
        use_ocr = st.checkbox("Use OCR for PDF", value=OCR_AVAILABLE, help="Enable OCR for better text extraction")
        
        # Process button
        analyze_button = st.button("🔍 Analyze Resume", type="primary")
        
        st.markdown("---")
        st.markdown("### About")
        st.markdown("""
        This tool helps you optimize your resume for specific job descriptions using:
        - Advanced AI analysis
        - Keyword matching
        - PDF generation with professional formatting
        """)
    
    # Main content area - Using tabs for organization
    tab1, tab2, tab3 = st.tabs(["📊 Analysis Results", "📝 Resume Optimization", "📄 Generated Resume"])
    
    # Processing logic
    if analyze_button and resume_file is not None and job_description:
        with st.spinner("Analyzing your resume..."):
            # Extract text from resume
            resume_text = analyzer.extract_text_from_pdf(resume_file)
            if not resume_text or len(resume_text) < 100:
                st.error("⚠️ Could not extract sufficient text from the resume. Please check the PDF file.")
            else:
                # Analyze resume
                st.session_state.analysis_results = analyzer.analyze_resume_comprehensive(resume_text, job_description)
                st.session_state.analysis_done = True
                
                # Generate optimized PDF
                st.session_state.pdf_content = pdf_generator.generate_optimized_resume_pdf(
                    resume_text, 
                    st.session_state.analysis_results
                )
                
                st.success("✅ Analysis complete! Check the tabs for results.")
    
    # Tab 1: Analysis Results
    with tab1:
        if st.session_state.analysis_done:
            results = st.session_state.analysis_results
            
            # Match Score
            col1, col2 = st.columns(2)
            with col1:
                st.markdown(f"""
                <div class="metric-container">
                    <h3>Match Score</h3>
                    <h1 style="color: {'green' if results['match_score'] > 0.7 else 'orange' if results['match_score'] > 0.5 else 'red'};">
                        {results['match_score']*100:.1f}%
                    </h1>
                    <p>Similarity between your resume and the job description</p>
                </div>
                """, unsafe_allow_html=True)
            
            with col2:
                st.markdown("""
                <div class="metric-container">
                    <h3>Keyword Analysis</h3>
                    <p>Missing keywords that appear in the job description:</p>
                </div>
                """, unsafe_allow_html=True)
                if results['missing_keywords']:
                    for keyword in results['missing_keywords'][:7]:
                        st.markdown(f"- {keyword}")
                else:
                    st.markdown("✓ Great job! Your resume contains all key terms.")
            
            # Strengths and Weaknesses
            col1, col2 = st.columns(2)
            with col1:
                st.subheader("💪 Your Strengths")
                if results.get('strengths'):
                    for strength in results['strengths']:
                        st.markdown(f"- {strength}")
                else:
                    st.markdown("No specific strengths identified.")
            
            with col2:
                st.subheader("🔧 Areas to Improve")
                if results.get('weaknesses'):
                    for weakness in results['weaknesses']:
                        st.markdown(f"- {weakness}")
                else:
                    st.markdown("No specific weaknesses identified.")
            
            # Recommendations
            st.subheader("🔍 Detailed Recommendations")
            if results.get('recommendations'):
                for rec in results['recommendations']:
                    rec_type = rec.get('type', 'info')
                    st.markdown(f"""
                    <div class="recommendation-card {rec_type}">
                        <h4>{rec.get('title', 'Recommendation')}</h4>
                        <p><strong>Issue:</strong> {rec.get('description', '')}</p>
                        <p><strong>Action:</strong> {rec.get('action', '')}</p>
                    </div>
                    """, unsafe_allow_html=True)
            else:
                st.markdown("No specific recommendations.")
        else:
            st.info("📤 Upload your resume and a job description, then click 'Analyze Resume' to see results.")
    
    # Tab 2: Resume Optimization
    with tab2:
        if st.session_state.analysis_done:
            results = st.session_state.analysis_results
            
            st.subheader("✨ Suggested Improvements")
            
            # Professional Summary
            st.markdown("#### Professional Summary")
            if 'suggested_improvements' in results and 'summary' in results['suggested_improvements']:
                st.markdown(f"""
                <div class="metric-container success">
                    <p>{results['suggested_improvements']['summary']}</p>
                </div>
                """, unsafe_allow_html=True)
            else:
                st.markdown("No suggested improvements for your professional summary.")
            
            # Experience Enhancements
            st.markdown("#### Experience Enhancements")
            if 'suggested_improvements' in results and 'experience_enhancements' in results['suggested_improvements']:
                for i, enhancement in enumerate(results['suggested_improvements']['experience_enhancements']):
                    st.markdown(f"{i+1}. {enhancement}")
            else:
                st.markdown("No specific experience enhancements suggested.")
            
            # Keywords to Add
            st.markdown("#### Keywords to Add")
            if 'missing_keywords' in results:
                col1, col2 = st.columns([1, 2])
                with col1:
                    st.markdown("**Add these keywords:**")
                with col2:
                    st.markdown(", ".join(results['missing_keywords']))
            else:
                st.markdown("No specific keywords to add.")
            
            # Additional Skills
            st.markdown("#### Technical Skills to Highlight")
            if 'suggested_improvements' in results and 'skills_to_add' in results['suggested_improvements']:
                st.markdown(", ".join(results['suggested_improvements']['skills_to_add']))
            else:
                st.markdown("No specific technical skills to highlight.")
        else:
            st.info("📤 Upload your resume and a job description, then click 'Analyze Resume' to see results.")
    
    # Tab 3: Generated Resume
    with tab3:
        if st.session_state.analysis_done and st.session_state.pdf_content:
            # Display PDF and provide download button
            st.subheader("📄 Your Optimized Resume")
            
            # Create download button for PDF
            current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
            download_filename = f"optimized_resume_{current_time}.pdf"
            b64pdf = base64.b64encode(st.session_state.pdf_content).decode("utf-8")
            
            pdf_display = f'<iframe src="data:application/pdf;base64,{b64pdf}" width="100%" height="600" type="application/pdf"></iframe>'
            st.markdown(pdf_display, unsafe_allow_html=True)
            
            href = f'<a href="data:application/pdf;base64,{b64pdf}" download="{download_filename}" class="download-button">⬇️ Download Optimized Resume PDF</a>'
            st.markdown(href, unsafe_allow_html=True)
            
            st.markdown("""
            ### Next Steps
            1. Review the optimized resume
            2. Make any necessary adjustments
            3. Submit your application with confidence!
            """)
        else:
            st.info("📤 Upload your resume and a job description, then click 'Analyze Resume' to generate an optimized resume.")

if __name__ == "__main__":
    main()