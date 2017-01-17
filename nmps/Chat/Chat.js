module.exports = {
  sendMessage: function(client, message) {
    client.writeMCPE('text', {
      type: 1,
      source: 'Test',
      message: message
    });
  }
}
