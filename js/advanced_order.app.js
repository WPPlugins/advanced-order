/**
 * Created by c0ns0l3 on 22.10.14.
 */
var ADK_Sortable = ADK_Sortable || {};
(function($){
    $(function(){
        $.extend(ADK_Sortable,{
            sortableList: undefined,
            noticeHolder: undefined,
            noticeStatus: undefined,
            init: function(){
                this.sortableList = $('#the-list');
                this.noticeHolder = $('<div  id="so_notice"></div>').hide();
                this.noticeStatus = this.noticeHolder.append($('<p id="status">Reordering...</p>'));
                $('#wpbody-content').append(this.noticeHolder);
                this.enableSortable();
            },

            hideNotice: function() {
                this.noticeHolder.slideUp();
            },
            showNotice: function() {
                this.noticeHolder.show();
            },
            sortableUpdate: function(event,ui) {
                var $that = ADK_Sortable;
                $that.showNotice();
                var postSortData = $(this).sortable('serialize');
                var postSortOrder = [];
                $(this).find('.column-a_order_drag div').each(function(){
                    postSortOrder.push($(this).attr('id'));
                });
                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        action: 'a_order/update_order',
                        security: A_ORDER_JS.a_order_nonce,
                        a_order_taxonomy: $('form.search-form input[name="taxonomy"]').attr('value'),
                        a_order_order_id_data: postSortData,
                        a_order_order_data: JSON.stringify(postSortOrder)
                    },

                    success: function(data) {
                        $that.hideNotice();
                    }
                });

            },
            sortableHelper: function(event,ui){
                ui
                    .addClass('a_order_drag_helper')
                    .children()
                    .each(function() {
                        $(this).width( $(this).width() );
                    });
                return ui;
            },
            enableSortable: function() {
                $that = this;
                this.sortableList.sortable({
                    items: 'tr',
                    handle: '.column-a_order_drag',
                    axis: 'y',
                    forcePlaceholderSize: true,
                    forceHelperSize: true,
                    placeholder: 'a_order_drag_placeholder',
                    update : $that.sortableUpdate,
                    helper: $that.sortableHelper,
                    start: function (event, ui) {
                        ui.placeholder.height(ui.item.height());
                        console.log( ui.placeholder);
                       // ui.item.addClass('a-order-draggable');
                    },
                    stop: function(event,ui) {ui.item.removeClass('a_order_drag_helper');}
                });
            }
        });
        ADK_Sortable.init();

    });
})(jQuery)
