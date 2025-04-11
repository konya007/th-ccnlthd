const endpoint = {
    "categories": "categories/",
    "courses":"courses/",
    "lession": (id) => "courses/" + id + "/lesson/"
}

const BASE_URL = "https://thanhduong.pythonanywhere.com/"

export {
    endpoint,
    BASE_URL
}

