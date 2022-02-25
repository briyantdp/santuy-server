const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fs = require('fs')
const app = require('../app');

chai.use(chaiHttp);

describe('API Endpoint Testing', () => {
    it('GET Landing Page', (done) => {
        chai.request(app).get('/api/v1/customer/landing-page').end((err, res) =>{
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.be.an('object')
            expect(res.body).to.have.property('hero')
            expect(res.body.hero).to.have.all.keys('travelers', 'cities', 'spots')
            expect(res.body).to.have.property('recommended')
            expect(res.body.recommended).to.be.an('array')
            expect(res.body).to.have.property('specialOffers')
            expect(res.body.specialOffers).to.be.an('array')
            expect(res.body).to.have.property('testimonial')
            expect(res.body.testimonial).to.be.an('object')
            done();
        })
    });

    it('GET Detail Page', (done) => {
        chai.request(app).get('/api/v1/customer/detail-page/5e96cbe292b97300fc902222').end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.be.an('object')
            expect(res.body).to.have.property('sumBooking')
            expect(res.body).to.have.property('country')
            expect(res.body).to.have.property('imageId')
            expect(res.body.imageId).to.be.an('array')
            expect(res.body).to.have.property('facilitiesId')
            expect(res.body.facilitiesId).to.be.an('array')
            expect(res.body).to.have.property('similarRoomsId')
            expect(res.body.similarRoomsId).to.be.an('array')
            expect(res.body).to.have.property('title')
            expect(res.body).to.have.property('price')
            expect(res.body).to.have.property('city')
            expect(res.body).to.have.property('description')
            expect(res.body).to.have.property('testimonial')
            expect(res.body.testimonial).to.have.an('object')
            expect(res.body).to.have.property('bank')
            expect(res.body.bank).to.be.an('array')
            done();
        })

        
    });

    const image = __dirname + '/buktibayar.jpeg';
    const dataSample = {
        image,
        bookingStartDate : '2022-02-24T17:00:00.000+00:00',
        bookingEndDate : '2022-02-26T17:00:00.000+00:00',
        itemId : '5e96cbe292b97300fc902222',
        duration : 3,
        firstName : 'Bryant',
        lastName : 'Dawson',
        email : 'bryantdp@gmail.com',
        phone : '290329032930',
        bankFrom : 'Mandiri',
        accountHolder : 'Bryant',
    }

    it('POST Booking Page', (done) => {
        chai.request(app).post('/api/v1/customer/booking-page')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .field('bookingStartDate', dataSample.bookingStartDate)
        .field('bookingEndDate', dataSample.bookingEndDate)
        .field('itemId', dataSample.itemId)
        .field('duration', dataSample.duration)
        .field('firstName', dataSample.firstName)
        .field('lastName', dataSample.lastName)
        .field('email', dataSample.email)
        .field('phone', dataSample.phone)
        .field('bankFrom', dataSample.bankFrom)
        .field('accountHolder', dataSample.accountHolder)
        .attach('image', fs.readFileSync(dataSample.image), 'buktibayar.jpeg')
        .end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(201)
            expect(res).to.be.an('object')
            expect(res.body).to.have.all.keys('payments', '_id', 'bookingStartDate', 'bookingEndDate', 'invoice', 'itemId', 'totalPrice', 'customerId', '__v')
            expect(res.body.payments).to.have.all.keys('status', 'proofPayment', 'bankFrom', 'accountHolder')
            expect(res.body.itemId).to.have.all.keys('_id', 'title', 'price', 'duration')
            done()
        })
    })
})