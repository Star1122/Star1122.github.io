/* =================================================================== */
/* ---------------------------- Functions ---------------------------- */
/* =================================================================== */

var app = {
  tableView: {
    tableItems: [],
    selectedTableItems: [],
    page: 1,
    count: 10
  },

  /**
   * Initialize function
   */
  init: function () {
    this.tableItemGenerator();
    this.pageNavigation();
    this.clearSelectedItem();
    this.changePageCount();
  },

  /**
   * Placeholder table item generator
   * Need to replace with API request
   */
  tableItemGenerator: function () {
    // Generate table items
    for (var i = 0; i < 35; i++) {
      this.tableView.tableItems.push({
        name: 'Profile ' + (i + 1),
        type: 'Location',
        idNum: (i + 1),
        created: moment().format('DD/MM/YYYY H:mm A')
      });
    }

    // Update total number of items
    $('#total').html(this.tableView.tableItems.length);

    this.updateTableItems();
  },

  /**
   * Update table items
   */
  updateTableItems: function () {
    $('.table .table__item').remove();

    // Count start and end item index
    var start = this.tableView.count * (this.tableView.page - 1);
    var end = Math.min(this.tableView.tableItems.length, this.tableView.count * this.tableView.page);

    for (var i = start; i < end; i++) {
      var index = this.tableView.selectedTableItems.findIndex(function (item) {
        return item === i;
      });
      var checked = (index > -1) ? ' checked' : '';
      var dNone = (this.tableView.selectedTableItems.length > 0) ? ' d-none' : '';

      var item = '<div class="table__item d-flex-between">\n' +
        '  <div class="flex-1">\n' +
        '    <input type="checkbox" id="item' + i + '" class="css-checkbox"' + checked + '/>\n' +
        '    <label for="item' + i + '" class="css-label"></label>\n' +
        '  </div>\n' +
        '  <div class="flex-2">' + this.tableView.tableItems[i].name + '</div>\n' +
        '  <div class="flex-2">' + this.tableView.tableItems[i].type + '</div>\n' +
        '  <div class="flex-3">' + this.tableView.tableItems[i].idNum + '</div>\n' +
        '  <div class="flex-4">' + this.tableView.tableItems[i].created + '</div>\n' +
        '  <div class="flex-4 d-flex-end">\n' +
        '    <button class="btn table__item__action view' + dNone + '">View</button>\n' +
        '    <button class="btn table__item__action edit' + dNone + '">Edit</button>\n' +
        '    <button class="btn table__item__action delete' + dNone + '" disabled>Delete</button>\n' +
        '  </div>\n' +
        '</div>';
      $('.table').append(item);
    }

    this.updateNavStatus();
    this.tableItemSelect();
  },

  /**
   * Interaction with table item
   */
  tableItemSelect: function () {
    var self = this;

    $('.table__item .css-checkbox').on('change', function () {
      var id = parseInt($(this).attr('id').substr(4));

      // Update selectedTableItems
      if (this.checked) {
        self.tableView.selectedTableItems.push(id);
      } else {
        var index = self.tableView.selectedTableItems.findIndex(function (item) {
          return item === id;
        });
        if (index > -1) {
          self.tableView.selectedTableItems.splice(index, 1);
        }
      }

      self.updateSelectedSection();
    });
  },

  /**
   * Table page navigation
   */
  pageNavigation: function () {
    var self = this;

    $('.page-nav').on('click', function () {
      if ($(this).attr('id') === 'prev') {
        if (self.tableView.page > 1) {
          // Go to previous page
          self.tableView.page -= 1;
        }
      } else {
        if (self.tableView.page < Math.ceil(self.tableView.tableItems.length / self.tableView.count)) {
          // Go to next page
          self.tableView.page += 1;
        }
      }

      self.updateTableItems();
    });
  },

  /**
   * Update page navigation status
   */
  updateNavStatus: function () {
    // Update prev/next button status
    if (this.tableView.page === 1) {
      $('#prev').addClass('disabled');
    } else {
      $('#prev').removeClass('disabled');
    }
    if (this.tableView.page === Math.ceil(this.tableView.tableItems.length / this.tableView.count)) {
      $('#next').addClass('disabled');
    } else {
      $('#next').removeClass('disabled');
    }

    // Update count of items in page
    $('#count').html(Math.min(this.tableView.tableItems.length, this.tableView.count * this.tableView.page) - this.tableView.count * (this.tableView.page - 1));
  },

  /**
   * Clear selected table items
   */
  clearSelectedItem: function () {
    var self = this;

    $('#clear_selection').on('click', function () {
      self.tableView.selectedTableItems = [];

      self.updateTableItems();
      self.updateSelectedSection();
    });
  },

  /**
   * Show/hide selected/search sections and submit/filter buttons
   */
  updateSelectedSection: function () {
    var count = this.tableView.selectedTableItems.length;
    if (count > 0) {
      $('.section__selected h2').html(count + ' Selected');
      $('.section__search').addClass('d-none');
      $('.section__selected').removeClass('d-none');
      $('.table__item__action').addClass('d-none');
      $('#submit_form').addClass('d-none');
      $('#filter_profiles').removeClass('d-none');
    } else {
      $('.section__search').removeClass('d-none');
      $('.section__selected').addClass('d-none');
      $('.table__item__action').removeClass('d-none');
      $('#submit_form').removeClass('d-none');
      $('#filter_profiles').addClass('d-none');
    }
  },

  /**
   * Change page count
   */
  changePageCount: function () {
    var self = this;

    // Show count list
    $('.page-size__current').on('click', function () {
      $(this).addClass('active');
    });

    // Update page count
    $('.page-size__list__item').on('click', function () {
      var count = parseInt($(this).html());
      $('#current').html(count);
      self.tableView.count = count;
      self.tableView.page = 1;

      self.updateTableItems();

      $('.page-size__current').removeClass('active');
    });

    // Hide count list
    document.addEventListener("mousedown", function (e) {
      var clsName = e.target.className;
      if (!clsName || clsName.indexOf('page-size') === -1) {
        $('.page-size__current').removeClass('active');
      }
    });
  }
};

$(function () {
  app.init();
});