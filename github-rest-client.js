/* Ultra lightweight Github REST Client */
// original inspiration via https://gist.github.com/v1vendi/75d5e5dad7a2d1ef3fcb48234e4528cb
const token = "<<token here>>";
const githubClient = generateAPI("https://api.github.com", {
  headers: {
    "User-Agent": "xyz",
    Authorization: `bearer ${token}`,
  },
});

async function getRepo(name) {
  /* GET /repos/{owner}/{repo} */
  //let name = "Redux-Shopping-Cart-App";
  return githubClient.repos.mdsaleemj[name].get();
}

getRepo("react").then((repoInfo) => {
  console.log("repo", repoInfo);
});
async function generateRepoFromTemplate({ template, repoName }) {
  /* POST /repos/{template_owner}/{template_repo}/generate */
  return githubClient.repos[`${template}`].generate.post({ name: repoName });
}
// document.querySelector("#fetch-repo").addEventListener("click", () => {
//   //alert(document.querySelector("#repo-name").value);
//   const repoName = document.querySelector("#repo-name").value;
//   if (!repoName) return;
//   getRepo(repoName).then((repoInfo) => {
//     console.log("repo", repoInfo);
//     document.querySelector("#response").innerHTML = JSON.stringify(
//       repoInfo,
//       null,
//       2
//     );
//   });
// });

function generateAPI(baseUrl, defaults = {}, scope = []) {
  const callable = () => {};
  callable.url = baseUrl;
  return new Proxy(callable, {
    get({ url }, propKey) {
      const method = propKey.toUpperCase();
      const path = scope.concat(propKey);
      if (["GET", "POST", "PUT", "DELETE", "PATCH"].includes(method)) {
        return (data, overrides = {}) => {
          const payload = { method, ...defaults, ...overrides };
          switch (method) {
            case "GET": {
              if (data) url = `${url}?${new URLSearchParams(data)}`;
              break;
            }
            case "POST":
            case "PUT":
            case "PATCH": {
              payload.body = JSON.stringify(data);
            }
          }
          console.log(`Calling: ${url}`);
          console.log("payload", payload);
          return fetch(url, payload).then((d) => d.json());
        };
      }
      return generateAPI(`${url}/${propKey}`, defaults, path);
    },
    apply({ url }, thisArg, [arg] = []) {
      const path = url.split("/");
      return generateAPI(arg ? `${url}/${arg}` : url, defaults, path);
    },
  });
}
