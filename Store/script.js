fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('products');
        data.forEach(product => {
          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="title">${product.title}</div>
            <div class="price">Price: $${product.price}</div>
            <button class="button">Add to cart</button>
          `;
          container.appendChild(card);
        });
      });