module.exports = {
  sendMessage: function(client, message) {
    player.client.writeMCPE('text', {
      type: 1,
      source: 'Test',
      message: message
    });
  }
}
