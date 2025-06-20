import React from "react";

const reviews = [
  {
    img: "/reviews/review1.jpg",
    name: "Иван Петров",
    text: "Всё понравилось, машину выкупили быстро и по хорошей цене! Спасибо за честность и оперативность."
  },
  {
    img: "/reviews/review2.jpg",
    name: "Мария Смирнова",
    text: "Очень приятный сервис, всё объяснили, деньги получила сразу. Рекомендую!"
  },
  {
    img: "/reviews/review3.jpg",
    name: "Алексей Кузнецов",
    text: "Сомневался, но всё прошло отлично. Оценка честная, оформление быстрое."
  },
  {
    img: "/reviews/review4.jpg",
    name: "Ольга Иванова",
    text: "Продала авто за 30 минут! Спасибо менеджеру за помощь и поддержку."
  },
  {
    img: "/reviews/review5.jpg",
    name: "Дмитрий Соколов",
    text: "Лучший сервис в городе! Всё прозрачно, без скрытых комиссий."
  },
  {
    img: "/reviews/review6.jpg",
    name: "Екатерина Орлова",
    text: "Очень довольна, что обратилась именно сюда. Деньги получила сразу после сделки."
  },
  {
    img: "/reviews/review7.jpg",
    name: "Сергей Волков",
    text: "Быстро, удобно, профессионально. Буду советовать друзьям!"
  },
  {
    img: "/reviews/review8.jpg",
    name: "Анна Климова",
    text: "Спасибо за индивидуальный подход и честную оценку!"
  },
  {
    img: "/reviews/review9.jpg",
    name: "Павел Морозов",
    text: "Сделка прошла без проблем, всё понравилось."
  },
];

const ReviewsSection = () => (
  <section className="py-20 px-4">
    <div className="container mx-auto max-w-6xl">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Отзывы клиентов
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Реальные истории наших клиентов
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review, idx) => (
          <div
            key={idx}
            className="bg-black review-glass-border rounded-2xl p-4 flex flex-col items-center text-center shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="review-carbon-frame rounded-xl p-1 mb-4">
              <img
                src={review.img}
                alt={review.name}
                className="w-full h-56 md:h-64 object-contain rounded-xl"
              />
            </div>
            <div className="text-lg font-bold text-white mb-2 tracking-tight uppercase letter-spacing-wide">
              {review.name}
            </div>
            <div className="text-gray-200 text-base font-medium leading-relaxed">
              {review.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ReviewsSection; 