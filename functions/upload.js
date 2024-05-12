const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: "public_3EVAc7JS5PCvJTcn0733hUBthkA=",
  privateKey: "private_G2d8TZZTE+S2rKHYF/kl8DfIr6U=",
  urlEndpoint: "https://ik.imagekit.io/exn5diy1pdh",
});

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { base64Img, fileName } = JSON.parse(event.body);

  try {
    const result = await imagekit.upload({
      file: base64Img,
      fileName: `${fileName}`,
      folder: "/netlify-challenge/",
    });

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() }),
    };
  }
};
