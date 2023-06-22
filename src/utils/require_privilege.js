const {APIGuildMember} = require("discord-api-types/v9")

class PrivilegeError extends Error {
    constructor(message) {
        super(message);
        this.name = "PrivilegeError";
    }
}

/**
 * Checks if the user has a moderator or administrator role
 *
 * @param {APIGuildMember} member member whose permissions should be checked
 * @throws {TypeError} in case data or num do not have the expected type
 * @throws {PrivilegeError} in case the user does not have the permission to execute the command
 */
function check_privilege(member) {
    const moderatorRole = process.env.MOD_ROLE_ID
    const adminRole = process.env.ADMIN_ROLE_ID
    if (!member.roles.cache.has(adminRole) && !member.roles.cache.has(moderatorRole) && !member.guild.me.hasPermission('ADMINISTRATOR')) {
        throw new PrivilegeError("User does not have the permissions required.");
    }
}


function check_interaction_privilege(interaction) {
    try {
        check_privilege(interaction.member)
    } catch (e) {
        if (e instanceof PrivilegeError) {
            return interaction.reply({
                content: "You do not have the permissions required to use this command",
                ephemeral: true
            });
        }
        console.log(e)
    }
}


module.exports = {check_privilege, check_interaction_privilege,PrivilegeError}