const result = document.getElementById('result');

// eslint-disable-next-line require-jsdoc
async function main() {
  try {
    const userId = getUserId();
    const userInfo = await fetchUserInfo(userId);
    for (let i =0; i < 10; i++) {
      createView(userInfo.items[i]);
    }
  } catch (error) {
    console.error(`eエラーが発生しました(${error})`);
  }
}

// eslint-disable-next-line require-jsdoc
function fetchUserInfo(userId) {
  return fetch(
      `https://api.github.com/search/repositories?q=${userId}+in:name&sort=stars&order=desc`
  )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        } else {
          return response.json();
        }
      })
      .catch((error) => {
        throw new Error('ネットワークエラー');
      });
}

// eslint-disable-next-line require-jsdoc
function getUserId() {
  const value = document.getElementById('userId').value;
  return encodeURIComponent(value);
}

// eslint-disable-next-line require-jsdoc
function createView(userInfo) {
  const node = document.createElement('div');
  node.setAttribute('class', 'column');
  const txt = escapeHTML`
  <h4>${userInfo.full_name}</h4>
  <img src="${userInfo.owner.avatar_url}" 
  alt="${userInfo.owner.login}" height="100">
  <dl>
    <dt>☆${userInfo.stargazers_count}</dt>
    <dt>URL <a href="${userInfo.html_url}">
    ${userInfo.html_url}</a></dt>
    <dt>${userInfo.description}</dt>
  </dl>
  `;
  node.innerHTML = txt;
  result.appendChild(node);
}

// eslint-disable-next-line require-jsdoc
// function displayView(view) {
//   const result = document.getElementById('result');
//   result.innerHTML = view;
// }

// eslint-disable-next-line require-jsdoc
function escapeSpecialChars(str) {
  return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
}

// eslint-disable-next-line require-jsdoc
function escapeHTML(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i - 1];
    if (typeof value === 'string') {
      return result + escapeSpecialChars(value) + str;
    } else {
      return result + String(value) + str;
    }
  });
}
