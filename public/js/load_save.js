function save() {
  var filename = prompt("Enter filename");
  if (filename != null) {
    $.get("db/save?filename=" + filename, function(data) {
      alert("Success!");
    });
  }
}

function handleClick(filename) {
  $("#loadfilemodal").modal("hide");
  $.get("db/load?filename=" + filename, function(packet) {
    for (let other_client_id in packet) {
      if (clientData[other_client_id] == undefined)
        clientData[other_client_id] = {};
      clientData[other_client_id] = Object.assign(
        {},
        clientData[other_client_id],
        packet[other_client_id]
      );
      updateAllLines(packet[other_client_id]);
    }
  });
}

function load() {
  $.get("db/list", function(files) {
    $("#loadfilemodal-content").empty();
    for (var file of files) {
      console.log(file);
      $("#loadfilemodal-content").append(
        '<a onClick="handleClick(\'' +
          file +
          '\')" class="badge badge-light p-2 mr-2">' +
          file +
          "</a>"
      );
    }
    $("#loadfilemodal").modal("show");
  });
}
