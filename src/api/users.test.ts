import UsersApi from './users';

describe('UsersApi', () => {
    let usersApi: UsersApi;

    beforeAll(() => {
        usersApi = new UsersApi('y_NbAkKc66ryYTWUXYEu');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('listUsers', () => {
        it('returns the total users from a request if total = true', async () => {
            const usersResponse = await usersApi.listUsers({ total: true });
            expect(usersResponse.total).toBe(49);
        });
    });
});