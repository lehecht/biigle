/**
 * The notification list.
 *
 * Displays all InAppNotifications of the user in a list.
 */
biigle.$viewModel('notifications-list', function (element) {
    var notification = {
        props: ['item', 'removeItem'],
        data: function () {
            return {
                isLoading: false
            };
        },
        computed: {
            classObject: function () {
                if (this.item.data.type) {
                    return 'panel-' + this.item.data.type;
                }

                return 'panel-default';
            },
            isUnread: function () {
                return this.item.read_at === null;
            }
        },
        methods: {
            markRead: function () {
                this.isLoading = true;
                this.$http.put('/api/v1/notifications/' + this.item.id)
                    .then(function (response) {
                        this.isLoading = false;
                        this.item.read_at = new Date();

                        if (this.removeItem) {
                            biigle.notifications.store.remove(this.item.id);
                        }
                    }, biigle.messages.store.handleErrorResponse);

            }
        }
    };

    new Vue({
        el: element,
        components: {
            notification: notification
        },
        data: {
            notifications: biigle.notifications.store.all
        },
        methods: {
            hasNotifications: function () {
                return biigle.notifications.store.count() > 0;
            }
        }
    });
});
