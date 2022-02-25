const Category = require("../models/Category")
const Customer = require("../models/Customer")
const Item = require("../models/Item")
const SimilarRooms = require("../models/SimilarRooms")
const Bank = require("../models/Bank")
const Booking = require("../models/Booking")

module.exports = {
    landingPage : async (req, res) => {
        try {
        // GET Hero
        const customer = await Customer.find();
        const item = await Item.find();
        const similarRooms = await SimilarRooms.find()
        
        // GET Recommended Item
        const recommended = await Category.findOne({name : "Recommended"}).select("_id name").populate({
            path : "itemId", 
            select : "_id title imageId price city country sumBooking",
            option : {
                sort : {
                    sumBooking : 1
                }
            },
            perDocumentLimit : 5,
            populate : {path : "imageId", select : "_id imageUrl", perDocumentLimit : 1}
        })
        const specialOffers = await Category.findOne({name : "Special Offers"}).select("_id name").populate({
            path : "itemId", 
            select : "_id title imageId price city country sumBooking",
            option : {
                sort : {
                    sumBooking : -1
                }
            },
            perDocumentLimit : 6,
            populate : {path : "imageId", select : "_id imageUrl", perDocumentLimit : 1}
        })
        
        // GET Testimonial
        const testimonial = {
            "_id": "1",
            "imageUrl": "images/testimonial1.jpg",
            "name": "Happy Family",
            "rate": 4.55,
            "content": "What a great trip with my family and I should try again next time soon ...",
            "familyName": "Bryant Dawson Priyantoro",
            "familyOccupation": "Front End Developer"
          }

        res.status(200).json({
            hero : {
                "travelers": customer.length,
                "cities": item.length,
                "spots": similarRooms.length
            },
            recommended : recommended.itemId,
            specialOffers : specialOffers.itemId,
            testimonial
        })
        } catch (error) {
            console.log(error);
            res.status(500).json({message : "Internal server error"});
        }
    },
    detailPage : async (req, res) => {
        const {id} = req.params;
        try {
            // GET Detail Item
            const item = await Item.findOne({_id : id})
                .populate({path : "imageId", select : "_id imageUrl"})
                .populate({path : "facilitiesId", select : "_id name imageUrl qty"})
                .populate({path : "similarRoomsId", select : "_id title imageUrl price city country"})

            // GET Testimonial
            const testimonial = {
                "_id": "1",
                "imageUrl": "images/testimonial1.jpg",
                "name": "Happy Family",
                "rate": 4.55,
                "content": "What a great trip with my family and I should try again next time soon ...",
                "familyName": "Bryant Dawson Priyantoro",
                "familyOccupation": "Front End Developer"
            }

            // GET Bank
            const bank = await Bank.find();

            res.status(200).json({
                ...item._doc,
                testimonial,
                bank
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({message : "Internal server error"});
        }
    },
    bookingPage : async (req, res) => {
        try {
            const {
                bookingStartDate,
                bookingEndDate,
                itemId,
                duration,
                firstName,
                lastName,
                email,
                phone,
                bankFrom,
                accountHolder,
            } = req.body;
            
            if(!req.file) {
                return res.status(404).json({message : "Gambar tidak ditemukan"})
            }

            if (
                bookingStartDate === undefined ||
                bookingEndDate === undefined ||
                itemId === undefined ||
                duration === undefined ||
                firstName === undefined ||
                lastName === undefined ||
                email === undefined ||
                phone === undefined ||
                bankFrom === undefined ||
                accountHolder === undefined
                ) {
                    return res.status(404).json({message : "Lengkapi semua field"});
                }
            
            const item = await Item.findOne({_id : itemId})
            if(!item) {
                return res.status(404).json({message : "Item tidak ditemukan"})
            }

            item.sumBooking += 1;
            await item.save();
            
            let totalPrice = item.price * duration;
            let tax = totalPrice * 0.1;
            const invoice = Math.floor(1000000 + Math.random() * 9000000);

            const customer = await Customer.create({
                firstName,
                lastName,
                email,
                phone
            });

            const newBooking = {
                bookingStartDate,
                bookingEndDate,
                invoice,
                itemId : {
                    _id : item._id,
                    title : item.title,
                    price : item.price,
                    duration : req.body.duration,
                },
                totalPrice : totalPrice += tax,
                customerId : customer._id,
                payments : {
                    proofPayment: `images/${req.file.filename}`,
                    bankFrom,
                    accountHolder,
                    status: "Proses",
                } 
            }
            const booking = await Booking.create(newBooking);
            return res.status(201).json(booking);
        } catch (error) {
            console.log(error);
            res.status(500).json({message : "Internal server error"});
        }
    }
}