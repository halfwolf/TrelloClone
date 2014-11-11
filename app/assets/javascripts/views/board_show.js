TrelloClone.Views.BoardShow = Backbone.View.extend({
  template: JST["show"],

  newCardFormTemplate: JST["newcard"],

  events: {
    "click button.new-card": "renderCardForm",
    "click button.add-card": "postCard",
    "click button.delete-card": "deleteCard",
    "click button.new-list-link": "showListForm",
    "click button.add-list": "addList"
    },

  initialize: function() {
    this.listenTo(this.model, "sync add remove", this.render);
    this.listenTo(this.model, "sync", this.addSortable)
  },

  render: function() {
    var showView = this.template({
      board: this.model
    });
    this.$el.html(showView);
    return this;
  },

  renderCardForm: function(event) {
    event.preventDefault();
    var listId = $(event.currentTarget).parent().find(".list-id").val()
    var parent = $(event.currentTarget.parentElement)
    $(event.currentTarget).parent().empty()
    parent.html(this.newCardFormTemplate({ listId: listId }))
  },

  postCard: function(event) {
    event.preventDefault();
    var params = $(event.currentTarget).parent().serializeJSON()
    var newCard = new TrelloClone.Models.Card(params["card"]);
    var currentList = this.model.lists().get(params["card"]["list_id"])
    var that = this;
    currentList.cards().create(newCard, {
      success: function() {
        Backbone.history.navigate("#/boards/"+ that.model.id, true)
      }
    });
  },

  deleteCard: function(event) {
    event.preventDefault();
    var cardId = event.currentTarget.id;
    var listId = event.currentTarget.dataset.list
    var card = this.model.lists().get(listId).cards().get(cardId)
    var that = this
    card.destroy({
      success: function() {
        Backbone.history.navigate("#/boards/"+ that.model.id, true)
      }
    });
  },

  showListForm: function(event) {
    var $parent = $(event.currentTarget).parent();
    $parent.empty();
    var listForm = JST["newlist"]({
      board: this.model
    });
    $parent.html(listForm);
    debugger


  },
  
  addList: function(event) {
    
    event.preventDefault();
    var params = $(event.currentTarget).parent().serializeJSON()
    var newList = new TrelloClone.Models.List(params["list"]);
    var that = this;
    var lists = TrelloClone.boards.getOrFetch(params.list.board_id).lists();
    
    lists.create(newList, {
      success: function() {
        Backbone.history.navigate("#/boards/"+ newList.attributes.board_id, true)
      }
    });
  },

  addSortable: function() {
    $("ul#sortable").sortable({
      connectWith: ".connectedSortable",
      placeholder: "card-place-highlight"
    }).disableSelection();
  }

})