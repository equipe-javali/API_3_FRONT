import React, { useState } from 'react';
import './css/manualUsuario.css'; 

export default function ManualUsuario() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(prevIndex => prevIndex === index ? null : index); // Usando uma função de atualização para setActiveIndex
  };

  const data = [
    { title: 'Como fazer algo 1', content: 'Informações detalhadas sobre como fazer algo 1...' },
    { title: 'Como fazer algo 2', content: 'Informações detalhadas sobre como fazer algo 2...' },
    { title: 'Como fazer algo 3', content: 'Informações detalhadas sobre como fazer algo 3...' },
    // Adicione quantos itens desejar
  ];

  return (
    <div className="manual-container">
      <div className='TituloManual'>
        <header>
          <h1>Manual do Usuário</h1>
        </header>
      </div>
      <div className="accordion">
        {data.map((item, index: number) => (
          <div key={index} className="accordion-item">
            <div
              className={`accordion-title ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleAccordion(index)}
            >
              {item.title}
            </div>
            {activeIndex === index && (
              <div className="accordion-content">
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
