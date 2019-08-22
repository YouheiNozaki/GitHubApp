// eslint-disable-next-line require-jsdoc
async function main() {
  try {
    const userId = getUserId();
    const userInfo = await fetchUserInfo(userId);
    const view = createView(userInfo);
    displayView(view);
  } catch (error) {
    console.error(`eエラーが発生しました(${error})`);
  }
}

// eslint-disable-next-line require-jsdoc
function fetchUserInfo(userId) {
  return fetch(
      `https://api.github.com/search/repositories?q=${userId}+in:name,description&sort=stars&order=desc`
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
  return escapeHTML`
  <h4>${userInfo.items[0].full_name}</h4>
  <img src="${userInfo.items[0].owner.avatar_url}" 
  alt="${userInfo.items[0].owner.login}" height="100">
  <dl>
    <dt>☆☆☆</dt>
    <dd>${userInfo.items[0].stargazers_count}</dd>
    <dt>URL</dt>
    <dd><a href="${userInfo.items[0].html_url}">
    ${userInfo.items[0].html_url}</a></dd>
  </dl>
  `;
}

// eslint-disable-next-line require-jsdoc
function displayView(view) {
  const result = document.getElementById('result');
  result.innerHTML = view;
}

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
