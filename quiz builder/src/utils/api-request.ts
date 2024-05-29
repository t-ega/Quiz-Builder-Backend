class ApiRequest {
  //   this.baseUrl = "http://localhost:3000"

  static get(url: string) {
    fetch(url).then(() => {});
  }

  static post(url: string, data: any) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
  }

  static put(url: string, data: any) {}
}
