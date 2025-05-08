//servicios del módulo.
export const getServices = () => {
  const options = {}

  return new Promise((resolve, reject) => {
    axiosRequest(options).then(function (response) {
      resolve(response);
    });
  });
}
