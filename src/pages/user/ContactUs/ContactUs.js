import React, { useState } from 'react'; // Import useState
import { Mail, Phone, MapPin, Send, Instagram, Facebook } from 'lucide-react';
import { useNotification } from '../../../contexts/NotificationContext'; 

// Define brand colors for easy reference
const BRAND_COLORS = {
  darkBrown: '#484139',
  lightAccent: '#DDBB92',
  charcoalCard: '#35312C',
  lightText: '#E3D5C5',
};

const ContactUs = () => {
  // 1. State for form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // 2. Notification hook
  const { showSuccess, showError } = useNotification();

  // 3. Loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Handler for input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  // 3. Conditional Check for button enablement
  const isFormValid = formData.name.trim() !== '' && 
                      formData.email.trim() !== '' && 
                      formData.message.trim() !== '';

  const gradientClass = "bg-gradient-to-b from-[#484139] via-[#544C44] via-[#5D554C] via-[#655E54] to-[#6B5B4F]";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid && !isSubmitting) {
      setIsSubmitting(true);
      try {
        // Simulate API call - replace with actual API endpoint
        console.log("Form Submitted:", formData);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show success notification
        showSuccess("Message sent successfully! We'll get back to you soon.", 5000);
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          message: '',
        });
        
      } catch (error) {
        console.error("Error sending message:", error);
        showError("Failed to send message. Please try again.", 5000);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className={`${gradientClass} min-h-screen flex items-center justify-center p-8`}>
      
      {/* Main Contact Card Container with Radial Gradient */}
      <div 
        className="w-full max-w-5xl rounded-3xl p-8 md:p-12 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10"
        style={{
          backgroundImage: `radial-gradient(at 50% 50%, rgba(255, 255, 255, 0.05) 0%, rgba(53, 49, 44, 0.9) 100%)`, 
          backdropFilter: 'blur(4px)'
        }}
      >

        <h1 className="text-5xl font-serif font-bold text-center mb-2 text-white">
          Let's Talk
        </h1>
        <p className={`text-center mb-10 text-xl font-light text-[${BRAND_COLORS.lightText}]`}>
          We're here to help you find your perfect skincare match.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* 1. Contact Form Section */}
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-serif font-bold mb-6 text-white">Send us a Message</h2>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Name Input */}
              <div>
                <label htmlFor="name" className={`block text-sm font-medium mb-2 text-[${BRAND_COLORS.lightText}]`}>
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={`w-full p-4 rounded-xl border-2 border-white/10 bg-white/5 placeholder-gray-400 text-white focus:ring-1 focus:ring-[${BRAND_COLORS.lightAccent}] focus:border-[${BRAND_COLORS.lightAccent}] transition duration-200`}
                />
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 text-[${BRAND_COLORS.lightText}]`}>
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full p-4 rounded-xl border-2 border-white/10 bg-white/5 placeholder-gray-400 text-white focus:ring-1 focus:ring-[${BRAND_COLORS.lightAccent}] focus:border-[${BRAND_COLORS.lightAccent}] transition duration-200`}
                />
              </div>

              {/* Message Input */}
              <div>
                <label htmlFor="message" className={`block text-sm font-medium mb-2 text-[${BRAND_COLORS.lightText}]`}>
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  className={`w-full p-4 rounded-xl border-2 border-white/10 bg-white/5 placeholder-gray-400 text-white focus:ring-1 focus:ring-[${BRAND_COLORS.lightAccent}] focus:border-[${BRAND_COLORS.lightAccent}] transition duration-200 resize-none`}
                ></textarea>
              </div>

              {/* Submit Button (Conditional Styling and Disabled state) */}
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting} // Button is disabled if the form is NOT valid or submitting
                className={`w-full md:w-auto flex items-center justify-center px-8 py-3 rounded-full font-bold text-lg shadow-lg transition duration-300
                  ${isFormValid && !isSubmitting
                    ? `bg-[${BRAND_COLORS.lightAccent}] text-[${BRAND_COLORS.darkBrown}] hover:bg-opacity-90` // Enabled style
                    : 'bg-gray-500/50 text-gray-300 cursor-not-allowed'} // Disabled style
                `}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 mr-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 2. Contact Info Section (Unchanged) */}
          <div className="order-1 lg:order-2 flex flex-col justify-center space-y-8 p-6 bg-[${BRAND_COLORS.charcoalCard}] rounded-xl shadow-xl">
            <h2 className="text-3xl font-serif font-bold text-white mb-4">Contact Details</h2>

            {/* Address */}
            <div className="flex items-start space-x-4">
              <MapPin className={`w-6 h-6 mt-1 text-[${BRAND_COLORS.lightAccent}] flex-shrink-0`} />
              <div>
                <p className={`font-bold text-lg text-white`}>Our Location</p>
                <p className={`text-[${BRAND_COLORS.lightText}]`}>
                  Glowy HQ, 123 Radiant Avenue, <br />
                  Skincare City, CA 90210
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4">
              <Mail className={`w-6 h-6 mt-1 text-[${BRAND_COLORS.lightAccent}] flex-shrink-0`} />
              <div>
                <p className={`font-bold text-lg text-white`}>Email Us</p>
                <a href="mailto:support@glowy.com" className={`text-[${BRAND_COLORS.lightText}] hover:text-white transition duration-200`}>
                  support@glowy.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-4">
              <Phone className={`w-6 h-6 mt-1 text-[${BRAND_COLORS.lightAccent}] flex-shrink-0`} />
              <div>
                <p className={`font-bold text-lg text-white`}>Call Us</p>
                <a href="tel:+1234567890" className={`text-[${BRAND_COLORS.lightText}] hover:text-white transition duration-200`}>
                  +1 (234) 567-890
                </a>
              </div>
            </div>
            
            {/* Social Media Links */}
            <div className="pt-4 border-t border-white/10">
                <p className={`font-bold text-lg text-white mb-3`}>Connect With Us</p>
                <div className="flex space-x-4">
                    <a href="#" aria-label="Instagram" className="text-white hover:text-[#DDBB92] transition">
                        <Instagram className="w-6 h-6" />
                    </a>
                    <a href="#" aria-label="Facebook" className="text-white hover:text-[#DDBB92] transition">
                        <Facebook className="w-6 h-6" />
                    </a>
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactUs;