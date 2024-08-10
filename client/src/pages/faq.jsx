import React, { useState } from 'react';

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is the main objective of the web application project?",
      answer: "The main objective of the web application project is to address sustainability in the community by providing a platform that improves sustainability through education, community engagement, resource management, and event coordination. The web application aims to raise awareness, encourage participation in sustainability initiatives, and streamline resource management within the community.",
    },
    {
      question: "What role does the Community Club (CC) play in promoting sustainability within the community?",
      answer: "The Community Club (CC) plays a vital role in promoting sustainability by organizing and hosting various educational, recreational, and social activities that focus on sustainable practices. These activities include workshops on waste reduction, energy conservation, and green living tips, which help raise awareness among residents and encourage them to adopt more sustainable behaviors.",
    },
    {
      question: "How can the web application support the Community Club's (CC) efforts in sustainability?",
      answer: "The web application can support the Community Club's (CC) efforts by providing a platform to advertise sustainability-related events, manage event registrations, and communicate with participants. The platform can also offer resources and tools that CC staff can use to plan and coordinate events more efficiently, thereby enhancing the impact of their sustainability initiatives.",
    },
    {
      question: "What types of sustainability-related events might the Community Club (CC) organize?",
      answer: "The Community Club (CC) might organize events such as recycling drives, eco-friendly workshops, tree planting activities, energy-saving seminars, and green living expos. These events are designed to engage residents in sustainable practices and foster a sense of community responsibility towards environmental conservation.",
    },
    {
      question: "How can residents benefit from the Community Club’s (CC) sustainability initiatives?",
      answer: "Residents can benefit from the Community Club’s (CC) sustainability initiatives by gaining access to valuable information and resources on sustainable living. They can also participate in community events that promote environmental stewardship, which not only helps them adopt greener habits but also strengthens their connection to the community through shared goals and collaborative efforts.",
    },
    {
        question: "What challenges might the Community Club (CC) face in implementing sustainability initiatives, and how can the web application help address them?",
        answer: "Challenges the Community Club (CC) might face include limited resident participation, difficulties in coordinating events, and a lack of awareness about sustainability issues. The web application can help address these challenges by providing easy access to information, facilitating communication between staff and residents, and offering tools to streamline event management and increase participation through targeted outreach.",
      },
    {
      question: "In what ways can the Community Club (CC) collaborate with other community organizations through the web application?",
      answer: "The Community Club (CC) can collaborate with other community organizations, such as Residents' Committees (RCs) and Town Councils, by using the web application to coordinate joint sustainability projects, share resources, and promote cross-organization events. This collaboration can amplify the impact of sustainability efforts by leveraging the strengths and reach of multiple organizations.",
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
