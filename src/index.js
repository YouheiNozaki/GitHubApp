// eslint-disable-next-line require-jsdoc
function fetchUserInfo(items) {
  fetch(
      `https://api.github.com/search/repositories?q=${items}+in:name,description&sort=stars&order=desc`
  )
      .then((response) => {
        if (!response.ok) {
          console.error('サーバーエラー', response);
        } else {
          return response.json().then((items) => {
            const view = escapeHTML`
            
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
