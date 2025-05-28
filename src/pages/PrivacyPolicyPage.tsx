import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
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
        <span className="text-gray-800 font-medium">Privacy Policy</span>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 prose lg:prose-lg max-w-none">
        <div className="flex items-center mb-6">
            <Shield className="h-10 w-10 text-blue-900 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 m-0">Privacy Policy</h1>
        </div>
        
        <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Introduction</h2>
        <p>
          Welcome to EstateIQ. We are committed to protecting your personal information and your right to privacy. 
          If you have any questions or concerns about this privacy notice, or our practices with regards to your personal 
          information, please contact us.
        </p>
        <p>
          This privacy notice describes how we might use your information if you visit our website at [Your Website URL] or 
          use our services. It also explains your privacy rights and how the law protects you.
        </p>

        <h2>2. Information We Collect</h2>
        <p>
          We collect personal information that you voluntarily provide to us when you register on the Service, express an 
          interest in obtaining information about us or our products and services, when you participate in activities on 
          the Service or otherwise when you contact us.
        </p>
        <p>
          The personal information that we collect depends on the context of your interactions with us and the Service, 
          the choices you make and the products and features you use. The personal information we collect may include the following:
        </p>
        <ul>
          <li><strong>Personal Information Provided by You:</strong> We collect names; email addresses; passwords; contact preferences; and other similar information.</li>
          <li><strong>Property Information:</strong> If you use our price prediction tools, we collect information you provide about properties, such as address, size, number of rooms, features, etc. This information is used to provide the prediction service and improve our AI models.</li>
          <li><strong>Usage Data:</strong> We may automatically collect usage data when you access and use the Service. This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>
          We use personal information collected via our Service for a variety of business purposes described below. 
          We process your personal information for these purposes in reliance on our legitimate business interests, 
          in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
        </p>
        <ul>
          <li><strong>To provide and maintain our Service:</strong> including to monitor the usage of our Service and improve our AI models.</li>
          <li><strong>To manage your account:</strong> to manage your registration as a user of the Service.</li>
          <li><strong>To contact you:</strong> To contact you by email, telephone calls, SMS, or other equivalent forms of electronic communication regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</li>
          <li><strong>For other business purposes:</strong> Such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.</li>
        </ul>

        <h2>4. Sharing Your Personal Information</h2>
        <p>
          We may share your information with third-party vendors, service providers, contractors or agents who perform services for us or on our behalf and require access to such information to do that work. Examples include: data analysis, email delivery, hosting services, customer service and marketing efforts.
        </p>
        <p>
          We may also share your personal information in the following situations:
        </p>
        <ul>
            <li><strong>With your consent:</strong> We may disclose your personal information for any other purpose with your consent.</li>
            <li><strong>For business transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            <li><strong>With Affiliates:</strong> We may share your information with our affiliates, in which case we will require those affiliates to honor this privacy notice.</li>
            <li><strong>For Legal Reasons:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
        </ul>

        <h2>5. Data Security</h2>
        <p>
          We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. 
          However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology 
          can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be 
          able to defeat our security and improperly collect, access, steal, or modify your information.
        </p>

        <h2>6. Your Privacy Rights</h2>
        <p>
          Depending on your location, you may have certain rights regarding your personal information. These may include the right to access, correct, delete, or restrict the use of your personal information. 
          If you would like to exercise any of these rights, please contact us.
        </p>

        <h2>7. Changes to This Privacy Notice</h2>
        <p>
          We may update this privacy notice from time to time. The updated version will be indicated by an updated "Last Updated" date and the updated version will be effective as soon as it is accessible. 
          We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.
        </p>

        <h2>8. Contact Us</h2>
        <p>
          If you have questions or comments about this notice, you may <Link to="/contact-us" className="text-blue-800 hover:underline">contact us</Link> by email at contact@estateiq.com or by post to:
        </p>
        <p>
          EstateIQ Headquarters<br/>
          123 AI Avenue, Suite 404<br/>
          Tech City, TC 54321, USA
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 