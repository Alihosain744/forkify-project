import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

// this function will return a reject promise after given seconds
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (
  url,
  uploadData = undefined,
  isForm = false
) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': isForm
              ? 'application/x-www-form-urlencoded'
              : 'application/json',
          },
          body: isForm ? uploadData : JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw `${err} 🔥🔥🔥🔥🔥🔥`;
  }
};

// export const AJAX = async function (url, uploadData = undefined) {
//   try {
//     const fetchPro = uploadData
//       ? fetch(`${url}`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(uploadData),
//         })
//       : fetch(`${url}`);

//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data; // is the fulfilled value of the getJSON function
//   } catch (err) {
//     throw `${err} 🔥🔥🔥🔥🔥🔥`;
//   }
// };

// export const getJSON = async function (url) {
//   try {
//     /*
//     Promise.race([pr1,pr2,....])
//     returns a promise no matter it is fulfilled or reject, so here if fetch cannot read data after 10 seconds
//     then the timeout promise will win the race and shows the error Request took too long!
//     */
//     const res = await Promise.race([fetch(`${url}`), timeout(TIMEOUT_SEC)]);

//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data; // is the fulfilled value of the getJSON function
//   } catch (err) {
//     throw `${err} 🔥🔥🔥🔥🔥🔥`;
//   }
// };

// export const sendJSON = async function (url, uploadData) {
//   try {
//     /*
//     Promise.race([pr1,pr2,....])
//     returns a promise no matter it is fulfilled or reject, so here if fetch cannot read data after 10 seconds
//     then the timeout promise will win the race and shows the error Request took too long!
//     */

//     const fetchPro = fetch(`${url}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(uploadData),
//     });
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data; // is the fulfilled value of the getJSON function
//   } catch (err) {
//     throw `${err} 🔥🔥🔥🔥🔥🔥`;
//   }
// };
