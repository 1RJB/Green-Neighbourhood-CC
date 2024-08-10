import React, { useState } from 'react';

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is the purpose of this website?",
      answer: "This website serves as a platform for managing events, users, and various related activities.",
    },
    {
      question: "How can I register on the platform?",
      answer: "You can register by clicking on the 'Register' button on the homepage and filling in your details.",
    },
    {
      question: "How do I reset my password?",
      answer: "If you've forgotten your password, you can reset it by clicking on 'Forgot Password' on the login page.",
    },
    {
      question: "Can I edit my profile information?",
      answer: "Yes, you can edit your profile information by navigating to the 'Profile' section after logging in.",
    },
    {
      question: "How can I contact support?",
      answer: "You can contact support by clicking on the 'Contact Us' link in the footer of the website.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Frequently Asked Questions</h2>
      <div style={styles.faqContainer}>
        {faqs.map((faq, index) => (
          <div key={index} style={styles.faqItem}>
            <button
              onClick={() => toggleFaq(index)}
              style={styles.questionButton}
            >
              {faq.question}
              <span style={styles.icon}>{openIndex === index ? '-' : '+'}</span>
            </button>
            <div
              style={{
                ...styles.answerWrapper,
                maxHeight: openIndex === index ? '1000px' : '0',
              }}
            >
              <div style={styles.answer}>
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: 'auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  faqContainer: {
    borderTop: '1px solid #ddd',
  },
  faqItem: {
    marginBottom: '10px',
  },
  questionButton: {
    width: '100%',
    textAlign: 'left',
    padding: '15px',
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: '#f9f9f9',
    border: 'none',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  icon: {
    fontSize: '24px',
    lineHeight: '24px',
  },
  answerWrapper: {
    overflow: 'hidden',
    transition: 'max-height 0.4s ease',
    backgroundColor: '#fff',
    borderBottom: '1px solid #ddd',
  },
  answer: {
    padding: '15px',
    fontSize: '16px',
    lineHeight: '1.5',
  },
};

export default FaqPage;
