import React from 'react';
import './ContactsPage.css';

const ContactsPage: React.FC = () => {
  return (
    <div className="contacts-container">
      <h2>КОНТАКТЫ</h2>
      <p>
        VK: <a href="https://vk.com/..." target="_blank" rel="noopener noreferrer">
          https://vk.com/...
        </a>
      </p>
      <p>Почта: example(a)gmail.com</p>
      <p>Site of servers</p>
    </div>
  );
};

export default ContactsPage;
