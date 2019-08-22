// eslint-disable-next-line require-jsdoc
async function main() {
  try {
    const userId = getUserId();
    const UserInfo = await fetchUserInfo(userId);
    const view = createView(UserInfo);
    displayView(view);
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
function createView(UserInfo) {
  return escapeHTML`
  <h4>${UserInfo.items[0].full_name}</h4>
  <img src="${UserInfo.items[0].owner.avatar_url}" 
  alt="${UserInfo.items[0].owner.login}" height="100">
  <dl>
    <dt>☆${UserInfo.items[0].stargazers_count}</dt>
    <dt>URL <a href="${UserInfo.items[0].html_url}">
    ${UserInfo.items[0].html_url}</a></dt>
    <dt>${UserInfo.items[0].description}</dt>
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
