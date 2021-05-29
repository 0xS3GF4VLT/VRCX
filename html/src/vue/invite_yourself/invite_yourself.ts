import * as api from '../../api';
import {parseLocation} from '../../location';

export default {
    name: 'InviteYourself',
    props: {
        location: String
    },
    methods: {
        parse(this: any) {
            var L = parseLocation(this.location);
            this.$el.style.display = L.isOffline || L.isPrivate ? 'none' : '';
        },
        async confirm(this: any) {
            var L = parseLocation(this.location);
            if (L.isOffline || L.isPrivate || L.worldId === '') {
                return;
            }
            try {
                var args = await api.getCachedWorld({
                    worldId: L.worldId
                });
                if (api.currentUser.status === 'busy') {
                    this.$message({
                        message:
                            "You can't invite yourself in 'Do Not Disturb' mode",
                        type: 'error'
                    });
                    return;
                }
                api.sendInvite(api.currentUser.id, {
                    instanceId: L.location,
                    worldId: L.location,
                    worldName: args.ref.name
                }).finally(() => {
                    this.$message({
                        message: 'Invite sent to yourself',
                        type: 'success'
                    });
                });
            } catch (err) {
                console.error(err);
            }
        }
    },
    watch: {
        location(this: any) {
            this.parse();
        }
    },
    mounted(this: any) {
        this.parse();
    }
};