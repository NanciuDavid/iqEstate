import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FileText } from 'lucide-react';

const TermsOfServicePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-blue-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-800 font-medium">Terms of Service</span>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 prose lg:prose-lg max-w-none">
        <div className="flex items-center mb-6">
            <FileText className="h-10 w-10 text-blue-900 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 m-0">Terms of Service</h1>
        </div>
        
        <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using EstateIQ (the "Service"), you agree to be bound by these Terms of Service ("Terms"). 
          If you disagree with any part of the terms, then you may not access the Service. 
          These Terms apply to all visitors, users, and others who access or use the Service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          EstateIQ provides an AI-powered real estate platform offering property price predictions, market insights, 
          and related information. The Service is for informational and research purposes only and should not be 
          considered as financial, investment, or professional real estate advice.
        </p>

        <h2>3. Use of Service</h2>
        <p>
          You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
        </p>
        <ul>
          <li>In any way that violates any applicable national or international law or regulation.</li>
          <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
          <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
          <li>To impersonate or attempt to impersonate EstateIQ, an EstateIQ employee, another user, or any other person or entity.</li>
          <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which, as determined by us, may harm EstateIQ or users of the Service or expose them to liability.</li>
        </ul>

        <h2>4. Intellectual Property</h2>
        <p>
          The Service and its original content (excluding Content provided by users), features, and functionality are 
          and will remain the exclusive property of EstateIQ and its licensors. The Service is protected by copyright, 
          trademark, and other laws of both the [Your Country/Jurisdiction] and foreign countries. Our trademarks and trade dress 
          may not be used in connection with any product or service without the prior written consent of EstateIQ.
        </p>
        
        <h2>5. AI Predictions and Information Disclaimer</h2>
        <p>
          The AI-generated price predictions, market analyses, and other information provided by the Service are based on 
          complex algorithms and available data. While we strive for accuracy, EstateIQ makes no representations or 
          warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or 
          availability with respect to the Service or the information, products, services, or related graphics contained 
          on the Service for any purpose. Any reliance you place on such information is therefore strictly at your own risk.
        </p>
        <p>
          Predictions are not guarantees of future value or sale price. Market conditions can change rapidly, and numerous 
          unforeseen factors can affect property values. You should always seek the advice of qualified professionals 
          (e.g., licensed real estate agents, appraisers, financial advisors) before making any real estate decisions.
        </p>

        <h2>6. User Accounts</h2>
        <p>
          When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. 
          Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
        </p>
        <p>
          You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, 
          whether your password is with our Service or a third-party service. You agree not to disclose your password to any third party. 
          You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          In no event shall EstateIQ, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, 
          incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
          intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content 
          of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your 
          transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not 
          we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
        </p>

        <h2>8. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, 
          we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change 
          will be determined at our sole discretion.
        </p>
        <p>
          By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. 
          If you do not agree to the new terms, please stop using the Service.
        </p>

        <h2>9. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please <Link to="/contact-us" className="text-blue-800 hover:underline">contact us</Link>.
        </p>
      </div>
    </div>
  );
};

export default TermsOfServicePage; 