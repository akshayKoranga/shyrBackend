var getResponse = (hints) => {
 var hint = {};
 hint.name = hints.name;
 hint.description = hints.description;
 return hint;
}

module.exports = {
  getResponse
};
