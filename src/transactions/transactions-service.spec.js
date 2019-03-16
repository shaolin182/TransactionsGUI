'use strict';

describe('Unit Testing of transactionsServiceModule module', function() {
    let transactions;

    /* Load transactionsServices module */
    beforeEach(module('transactionsServiceModule'));

    /* Inject Transactions module */
    beforeEach(inject(function(_Transactions_) {
        transactions = _Transactions_;
    }));

    it('Unit test initTransaction', function(done) {
        const result = transactions.initTransaction();

        result.income.should.equal(0, 'income should be initialized to 0');
        result.outcome.should.equal(0, 'outcome should be initialized to 0');
        result.multi.should.equal(false, 'multi should be initialized to false');
        assert.isOk(result.date instanceof Date, 'property date is not properly instanciated');

        done();
    });

    it('Unit test reinitTransaction - nominal case', function(done) {
        const aTransaction = {
            income: 25,
            outcome: 10,
            multi: true,
            date: 'aFakeDate',
            bankaccount: {
                id: 1,
                category: 'PEE',
                label: 'Actions Sopra',
            },
        };

        const result = transactions.reinitTransaction(aTransaction);

        result.income.should.equal(0, 'income should be initialized to 0');
        result.outcome.should.equal(0, 'outcome should be initialized to 0');
        result.multi.should.equal(false, 'multi should be initialized to false');
        result.date.should.equal('aFakeDate', 'date should be initialized');
        result.bankaccount.category.should.equal('PEE', 'bankaccount information should be transfer from transaction');
        result.bankaccount.label.should.equal('Actions Sopra', 'bankaccount information should be transfer from transaction');
        result.bankaccount.id.should.equal(1, 'bankaccount information should be transfer from transaction');

        done();
    });

    it('Unit test reinitTransaction - exception case - empty parameter', function(done) {
        const aTransaction = {};

        const result = transactions.reinitTransaction(aTransaction);

        result.income.should.equal(0, 'income should be initialized to 0');
        result.outcome.should.equal(0, 'outcome should be initialized to 0');
        result.multi.should.equal(false, 'multi should be initialized to false');
        should.not.exist(result.date, 'date should not be initialized');
        should.not.exist(result.bankaccount, 'bankaccount information should not be initialized');

        done();
    });
});
