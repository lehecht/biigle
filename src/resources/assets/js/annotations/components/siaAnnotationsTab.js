import AnnotationsTab from './annotationsTab';

/**
 * Additional components that can be dynamically added by other Biigle modules via
 * view mixins. These components are meant for the "annotationsAnnotationsTab" view mixin
 * mount point.
 *
 * @type {Object}
 */
export let plugins = {};

/**
 * The specific implementation of the annotations tab for the still image annotation
 * tool.
 */
export default {
    mixins: [AnnotationsTab],
    computed: {
        plugins() {
            return plugins;
        },
    },
};
