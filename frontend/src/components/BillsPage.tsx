import React from 'react';
import './BillsPage.css';

const BillsPage: React.FC = () => {
    interface Bill {
        description: string;
        status: string;
        }
    const bills: Bill[] = [];

  return (
    <div className="bills-container">
      <h2>Счета</h2>

      <div className="balance-bar">
        <span><strong>Ваш баланс:</strong> 0.00 руб</span>
        <button><a href = "http://localhost:3000/profile">пополнить</a></button>
      </div>

      <div className="bill-controls">
        <label>
          Счетов
          <select>
            <option>5</option>
            <option>10</option>
            <option>25</option>
          </select>
          на страницу
        </label>
        <input type="text" placeholder="Поиск" />
      </div>

      <table className="bills-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Описание счета</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {bills.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center' }}>Список Ваших счетов пуст</td>
            </tr>
          ) : (
            bills.map((bill, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{bill.description}</td>
                <td>{bill.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <span>Показано с 0 по 0 из 0 возможных</span>
        <div>
          <button disabled>Предыдущая</button>
          <button disabled>Следующая</button>
        </div>
      </div>
    </div>
  );
};

export default BillsPage;
