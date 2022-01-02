//Текущая страница
var _NUMBER_ = 1;
var _TOTAL_ = 1;

function showLoginForm() {
  const loginForm = document.getElementsByClassName('loginForm');
  const marketForm = document.getElementsByClassName('marketForm');
  for (const element of loginForm) {
    element.hidden = false;
  }
  for (const element of marketForm) {
    element.hidden = true;
  }
}
function hideLoginForm() {
  const loginForm = document.getElementsByClassName('loginForm');
  const marketForm = document.getElementsByClassName('marketForm');
  for (const element of loginForm) {
    element.hidden = true;
  }
  for (const element of marketForm) {
    element.hidden = false;
  }
}

async function ChecAuth() {
  const access_token = localStorage.getItem('access_token');
  if (!access_token) {
    showLoginForm();
  } else {
    //Проверяем актуальность токена
    const response = await fetch('/profile', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + access_token,
      },
    });
    if (response.ok === true) {
      hideLoginForm();
    } else {
      localStorage.removeItem('access_token');
      showLoginForm();
      alert('Необхоимо войти');
    }
  }
}

async function GetProducts(number) {
  const access_token = localStorage.getItem('access_token');
  
  _NUMBER_ = _NUMBER_ + number;
  if (_NUMBER_ < 1) _NUMBER_ = 1;
  if (_NUMBER_ * 10 > _TOTAL_ + 10) _NUMBER_ = _NUMBER_ - 1;
  const skip = (_NUMBER_ - 1) * 10;
  console.log(number, _NUMBER_, _TOTAL_, skip);
  
  //let url = new URL('http://localhost:3000/product/paged');
  //url.searchParams.set('skip', skip);

  const response = await fetch('/product/paged?skip=' + skip, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
  });
  if (response.ok === true) {
    const resp = await response.json();
    let rows = document.getElementById('rows');
    rows.innerHTML = '';
    rows.appendChild(getTh());
    _TOTAL_ = resp.total;
    resp.data.forEach((prod) => {
      // добавляем полученные элементы в таблицу
      rows.appendChild(row(prod));
    });
  }
}

function getTh() {
  const tr = document.createElement('tr');
  const idTd = document.createElement('td');
  idTd.append('Артикул');
  tr.append(idTd);

  const nameTd = document.createElement('td');
  nameTd.append('Наименование');
  tr.append(nameTd);

  const priceTd = document.createElement('td');
  priceTd.append('Стоимость');
  tr.append(priceTd);

  return tr;
}

// создание строки для таблицы
function row(prod) {
  const tr = document.createElement('tr');
  tr.setAttribute('data-rowid', prod.id);

  const idTd = document.createElement('td');
  idTd.append(prod.id);
  tr.append(idTd);

  const nameTd = document.createElement('td');
  nameTd.append(prod.name);
  tr.append(nameTd);

  const priceTd = document.createElement('td');
  priceTd.append(prod.price + ' руб');
  tr.append(priceTd);

  const changeTd = document.createElement('td');
  const button = document.createElement('button');
  button.append((value = 'Изменить'));
  changeTd.append(button);
  changeTd.addEventListener('click', (e) => {
    e.preventDefault();
    const id = document.getElementById('id');
    id.value = prod.id;
    const name = document.getElementById('name');
    name.value = prod.name;
    const price = document.getElementById('price');
    price.value = prod.price;
  });
  tr.append(changeTd);

  return tr;
}

async function getJWT() {
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const response = await fetch('auth/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  });
  if (response.ok === true) {
    const resp = await response.json();
    //console.log('resp=', resp);
    if (!resp.access_token) {
      showLoginForm();
    } else {
      hideLoginForm();
      localStorage.removeItem('access_token');
      localStorage.setItem('access_token', resp.access_token);
      //await GetProducts();
    }
  } else {
    const resp = await response.json();
    alert(resp.message);
  }
}

async function SaveProduct() {
  let id = document.getElementById('id');
  let name = document.getElementById('name');
  let price = document.getElementById('price');
  if (id.value == 0) CreateProduct(name.value, price.value);
  else EditProduct(id.value, name.value, price.value);
  id.value = 0;
  name.value = '';
  price.value = '';
}

async function CreateProduct(name, price) {
  const response = await fetch('/product', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name,
      price: price,
    }),
  });
  if (response.ok === true) {
    const product = await response.json();
    let rows = document.getElementById('rows');
    rows.appendChild(row(product));
  } else {
    const resp = await response.json();
    alert(resp.message);
  }
}

async function EditProduct(id, name, price) {
  const response = await fetch('/product/' + id, {
    method: 'PUT',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name,
      price: price,
    }),
  });
  if (response.ok === true) {
    const product = await response.json();
    //let rows = document.getElementById('rows');
    document
      .querySelector("tr[data-rowid='" + product.id + "']")
      .replaceWith(row(product));
  } else {
    const resp = await response.json();
    alert(resp.message);
  }
}

window.onload = ChecAuth;
