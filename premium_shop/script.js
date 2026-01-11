function changePhoto(el){
    document.getElementById('main-photo').src = el.src;
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
}

function changeQty(v){
    const q = document.getElementById('qty');
    q.value = Math.max(1, parseInt(q.value) + v);
}

function addToCart(){
    const item = {
        title: document.querySelector('.title').innerText,
        price: +document.querySelector('.price').dataset.price,
        qty: +document.getElementById('qty').value
    };
    localStorage.setItem('cart', JSON.stringify(item));
    location = 'cart.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const item = JSON.parse(localStorage.getItem('cart'));
    const cart = document.getElementById('cart-content');

    if(cart && item){
        cart.innerHTML = `
            <p><strong>${item.title}</strong></p>
            <p>Ціна: ₴${item.price}</p>
            <p>Кількість: ${item.qty}</p>
            <p>Сума: ₴${item.price * item.qty}</p>
        `;
    }

    const form = document.getElementById('order-form');
    if(form){
        form.onsubmit = e => {
            e.preventDefault();

            const name = form.name.value;
            const phone = form.phone.value;
            const comment = form.comment.value || "-";

            // Масив ботів
            const BOTS = [
                { token: "8280424956:AAGL-CZcMR3p174mio2Fil4S6Zslp7t7t5U", chatId: "1233528378" },
                { token: "8027694731:AAFDon8bls0FOcugpqE-oVZMT_Jmp1zcxLg", chatId: "1340228881" }
            ];

            const text =
`🛒 *Нове замовлення*

*Товар:* ${item.title}
*Ціна:* ₴${item.price}
*Кількість:* ${item.qty}
*Сума:* ₴${item.price * item.qty}

👤 *Покупець:*
Ім'я: ${name}
Телефон: ${phone}
Коментар: ${comment}`;

            // Відправка в усі боти
            BOTS.forEach(bot => {
                fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({
                        chat_id: bot.chatId,
                        text: text,
                        parse_mode: "Markdown"
                    })
                })
                .catch(err => {
                    console.error('Помилка при відправці в бот:', bot.chatId, err);
                });
            });

            alert('Замовлення відправлено!');
            localStorage.removeItem('cart');
            location = 'index.html';
        };
    }
});
