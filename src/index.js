// eslint-disable-next-line require-jsdoc
function fetchUserInfo(searchId) {
  fetch(
      `https://api.github.com/search/repositories?q=${searchId}+in:name,description&sort=stars&order=desc`
  )
      .then((response) => {
        if (!response.ok) {
          console.error('サーバーエラー', response);
        } else {
          return response.json().then((userInfo) => {
            const view = escapeHTML`
            <h4>${userInfo.items[0].full_name}</h4>
            <img src="${userInfo.items[0].avatar_url}" alt="${userInfo.items[0].login}" height="100">
            <dl>
              <dt>スターの数</dt>
              <dd>${userInfo.items[0].stargazers_count}</dd>
              <dt>URL</dt>
              <dd><a href="${userInfo.items[0].html_url}">${userInfo.items[0].html_url}</a></dd>
            </dl>
            `;
            const result = document.getElementById('result');
            result.innerHTML = view;
          });
        }
      })
      .catch((error) => {
        console.error('ネットワークエラー', error);
      });
}

function escapeSpecialChars(str) {
  return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
}

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
